// Package swap provides various key functions to execute an atomic swap
package swap

import (
	"atomic-swaps/src/util"
	"bytes"
	"errors"
	"fmt"

	"github.com/DiviProject/divid/chaincfg/chainhash"
	rpcd "github.com/DiviProject/divid/rpcclient"
	"github.com/DiviProject/divid/txscript"
	"github.com/DiviProject/divid/wire"
	"github.com/DiviProject/diviutil"
	"github.com/DiviProject/diviwallet/wallet/txrules"
	"golang.org/x/crypto/ripemd160"
)

// ContractArgs : The common parameters used to create the atomic swap
// This includes the amount of funds, the address associated with the contract and the secret key
type ContractArgs struct {
	them       *diviutil.AddressPubKeyHash
	amount     diviutil.Amount
	locktime   int64
	secretHash []byte
}

// BuiltContract : The details regarding a contract and the contract
// This includes all the contract bytes, hashes and transaction data
type BuiltContract struct {
	contract       []byte
	contractP2SH   diviutil.Address
	contractTxHash *chainhash.Hash
	contractTx     *wire.MsgTx
	contractFee    diviutil.Amount
	refundTx       *wire.MsgTx
	refundFee      diviutil.Amount
}

// BuildContract : Builds an atomic swap contract transaction
// You need to pass in the contract arguments (as specified in ContractArgs)
// It will return all the contract transaction information
func BuildContract(c *rpcd.Client, args *ContractArgs, currency string) *BuiltContract {
	network := RetrieveNetwork(currency)

	RefundAddr, err := RawChangeAddress(c, currency)
	if err != nil {
		fmt.Println(err)
	}
	RefundAddrHash, ok := RefundAddr.(interface {
		Hash160() *[ripemd160.Size]byte
	})
	if !ok {
		fmt.Println("unable to create hash160 from change address")
	}

	contract, err := AtomicSwap(RefundAddrHash.Hash160(), args.them.Hash160(), args.locktime, args.secretHash)
	if err != nil {
		fmt.Println(err)
	}

	contractP2SH, err := diviutil.NewAddressScriptHash(contract, network)
	if err != nil {
		fmt.Println(err)
	}
	contractP2SHPkScript, err := txscript.PayToAddrScript(contractP2SH)
	if err != nil {
		fmt.Println(err)
	}

	feePerKb, minFeePerKb, err := GetFees(c)
	if err != nil {
		fmt.Println(err)
	}

	unsignedContract := wire.NewMsgTx(util.TXVersion)
	unsignedContract.AddTxOut(wire.NewTxOut(int64(args.amount), contractP2SHPkScript))
	unsignedContract, contractFee, err := FundTransaction(c, unsignedContract, feePerKb)
	if err != nil {
		fmt.Println(err)
	}
	contractTx, complete, err := SignTransaction(c, unsignedContract)
	if err != nil {
		fmt.Println(err)
	}
	if !complete {
		fmt.Println("signrawtransaction: failed to completely sign contract transaction")
	}

	contractTxHash := contractTx.TxHash()

	refundTx, refundFee, err := BuildRefund(c, contract, contractTx, feePerKb, minFeePerKb, currency)
	if err != nil {
		fmt.Println(err)
	}

	return &BuiltContract{
		contract,
		contractP2SH,
		&contractTxHash,
		contractTx,
		contractFee,
		refundTx,
		refundFee,
	}
}

// BuildRefund : Builds the refund contract
// In order to build the refund contract, you need to specify the refund fee and the atomic swap contract information
func BuildRefund(c *rpcd.Client, contract []byte, contractTx *wire.MsgTx, feePerKb, minFeePerKb diviutil.Amount, currency string) (refundTx *wire.MsgTx, refundFee diviutil.Amount, err error) {
	network := RetrieveNetwork(currency)

	contractP2SH, err := diviutil.NewAddressScriptHash(contract, network)
	if err != nil {
		return nil, 0, err
	}
	contractP2SHPkScript, err := txscript.PayToAddrScript(contractP2SH)
	if err != nil {
		return nil, 0, err
	}

	contractTxHash := contractTx.TxHash()
	contractOutPoint := wire.OutPoint{Hash: contractTxHash, Index: ^uint32(0)}
	for i, o := range contractTx.TxOut {
		if bytes.Equal(o.PkScript, contractP2SHPkScript) {
			contractOutPoint.Index = uint32(i)
			break
		}
	}
	if contractOutPoint.Index == ^uint32(0) {
		return nil, 0, errors.New("contract tx does not contain a P2SH contract payment")
	}

	refundAddress, err := RawChangeAddress(c, currency)
	if err != nil {
		return nil, 0, fmt.Errorf("getrawchangeaddress: %v", err)
	}
	refundOutScript, err := txscript.PayToAddrScript(refundAddress)
	if err != nil {
		return nil, 0, err
	}

	pushes, err := txscript.ExtractAtomicSwapDataPushes(0, contract)
	if err != nil {
		// expected to only be called with good input
		fmt.Println(err)
	}

	refundAddr, err := diviutil.NewAddressPubKeyHash(pushes.RefundHash160[:], network)
	if err != nil {
		return nil, 0, err
	}

	refundTx = wire.NewMsgTx(util.TXVersion)
	refundTx.LockTime = uint32(pushes.LockTime)
	refundTx.AddTxOut(wire.NewTxOut(0, refundOutScript)) // amount set below
	refundSize := util.EstimateRefundSerializeSize(contract, refundTx.TxOut)
	refundFee = txrules.FeeForSerializeSize(feePerKb, refundSize)
	refundTx.TxOut[0].Value = contractTx.TxOut[contractOutPoint.Index].Value - int64(refundFee)
	if txrules.IsDustOutput(refundTx.TxOut[0], minFeePerKb) {
		return nil, 0, fmt.Errorf("refund output value of %v is dust", diviutil.Amount(refundTx.TxOut[0].Value))
	}

	txIn := wire.NewTxIn(&contractOutPoint, nil, nil)
	txIn.Sequence = 0
	refundTx.AddTxIn(txIn)

	refundSig, refundPubKey, err := CreateSig(refundTx, 0, contract, refundAddr, c)
	if err != nil {
		return nil, 0, err
	}
	refundSigScript, err := RefundP2SHContract(contract, refundSig, refundPubKey)
	if err != nil {
		return nil, 0, err
	}
	refundTx.TxIn[0].SignatureScript = refundSigScript

	if util.Verify {
		e, err := txscript.NewEngine(contractTx.TxOut[contractOutPoint.Index].PkScript,
			refundTx, 0, txscript.StandardVerifyFlags, txscript.NewSigCache(10),
			txscript.NewTxSigHashes(refundTx), contractTx.TxOut[contractOutPoint.Index].Value)
		if err != nil {
			fmt.Println(err)
		}
		err = e.Execute()
		if err != nil {
			fmt.Println(err)
		}
	}

	return refundTx, refundFee, nil
}

// RefundP2SHContract : Create refundable P2SH Contract
// This provides a refund signature for the refund contract
func RefundP2SHContract(contract, sig, pubkey []byte) ([]byte, error) {
	b := txscript.NewScriptBuilder()
	b.AddData(sig)
	b.AddData(pubkey)
	b.AddInt64(0)
	b.AddData(contract)
	return b.Script()
}

// AtomicSwap : The assembly logic for atomic swap
// This uses OP commands in order to parse, validate and verify atomic swaps and pass funds to respective addresses
func AtomicSwap(pkhMe, pkhThem *[ripemd160.Size]byte, locktime int64, secretHash []byte) ([]byte, error) {
	b := txscript.NewScriptBuilder()

	b.AddOp(txscript.OP_IF) // Normal redeem path
	{
		// Require initiator's secret to be a known length that the redeeming
		// party can audit.  This is used to prevent fraud attacks between two
		// currencies that have different maximum data sizes.
		b.AddOp(txscript.OP_SIZE)
		b.AddInt64(util.SecretSize)
		b.AddOp(txscript.OP_EQUALVERIFY)

		// Require initiator's secret to be known to redeem the output.
		b.AddOp(txscript.OP_SHA256)
		b.AddData(secretHash)
		b.AddOp(txscript.OP_EQUALVERIFY)

		// Verify their signature is being used to redeem the output.  This
		// would normally end with OP_EQUALVERIFY OP_CHECKSIG but this has been
		// moved outside of the branch to save a couple bytes.
		b.AddOp(txscript.OP_DUP)
		b.AddOp(txscript.OP_HASH160)
		b.AddData(pkhThem[:])
	}
	b.AddOp(txscript.OP_ELSE) // Refund path
	{
		// Verify locktime and drop it off the stack (which is not done by
		// CLTV).
		b.AddInt64(locktime)
		b.AddOp(txscript.OP_CHECKLOCKTIMEVERIFY)
		b.AddOp(txscript.OP_DROP)

		// Verify our signature is being used to redeem the output.  This would
		// normally end with OP_EQUALVERIFY OP_CHECKSIG but this has been moved
		// outside of the branch to save a couple bytes.
		b.AddOp(txscript.OP_DUP)
		b.AddOp(txscript.OP_HASH160)
		b.AddData(pkhMe[:])
	}
	b.AddOp(txscript.OP_ENDIF)

	// Complete the signature check.
	b.AddOp(txscript.OP_EQUALVERIFY)
	b.AddOp(txscript.OP_CHECKSIG)

	return b.Script()
}
