// Package swap provides various key functions to execute an atomic swap
package swap

import (
	"atomic-swaps/src/api"
	"atomic-swaps/src/util"
	"bytes"
	"errors"
	"fmt"

	"github.com/DiviProject/divid/txscript"
	"github.com/DiviProject/divid/wire"
	"github.com/DiviProject/diviutil"
	"github.com/DiviProject/diviwallet/wallet/txrules"
)

// Redeem : Redeems an atomic swap
// Redeeming an atomic swap requires the secret hash
// You also need to be connected to the correct RPC client
func Redeem(contract []byte, contractTx wire.MsgTx, secret []byte, currency string, autopublish bool) (api.RedeemResponse, error) {
	network := RetrieveNetwork(currency)
	client := GetRPCClient(currency)

	defer func() {
		client.Shutdown()
		client.WaitForShutdown()
	}()

	pushes, err := txscript.ExtractAtomicSwapDataPushes(0, contract)
	if err != nil {
		return api.RedeemResponse{"", "", struct{}{}, nil, 51200}, err
	}
	if pushes == nil {
		return api.RedeemResponse{"", "", struct{}{}, nil, 51200}, errors.New("contract is not an atomic swap script recognized by this tool")
	}

	recipientAddr, err := diviutil.NewAddressPubKeyHash(pushes.RecipientHash160[:], network)
	if err != nil {
		return api.RedeemResponse{"", "", struct{}{}, nil, 51200}, err
	}
	contractHash := diviutil.Hash160(contract)
	contractOut := -1
	for i, out := range contractTx.TxOut {
		sc, addrs, _, _ := txscript.ExtractPkScriptAddrs(out.PkScript, network)
		if sc == txscript.ScriptHashTy &&
			bytes.Equal(addrs[0].(*diviutil.AddressScriptHash).Hash160()[:], contractHash) {
			contractOut = i
			break
		}
	}
	if contractOut == -1 {
		return api.RedeemResponse{"", "", struct{}{}, nil, 51200}, errors.New("transaction does not contain a contract output")
	}

	addr, err := RawChangeAddress(client, currency)
	if err != nil {
		return api.RedeemResponse{"", "", struct{}{}, nil, 51200}, err
	}
	outScript, err := txscript.PayToAddrScript(addr)
	if err != nil {
		return api.RedeemResponse{"", "", struct{}{}, nil, 51200}, err
	}

	contractTxHash := contractTx.TxHash()
	contractOutPoint := wire.OutPoint{
		Hash:  contractTxHash,
		Index: uint32(contractOut),
	}

	feePerKb, minFeePerKb, err := GetFees(client, currency)
	if err != nil {
		return api.RedeemResponse{"", "", struct{}{}, nil, 51200}, err
	}

	redeemTx := wire.NewMsgTx(util.TXVersion)
	redeemTx.LockTime = uint32(pushes.LockTime)
	redeemTx.AddTxIn(wire.NewTxIn(&contractOutPoint, nil, nil))
	redeemTx.AddTxOut(wire.NewTxOut(0, outScript)) // amount set below
	redeemSize := util.EstimateRedeemSerializeSize(contract, redeemTx.TxOut)
	fee := txrules.FeeForSerializeSize(feePerKb, redeemSize)
	redeemTx.TxOut[0].Value = contractTx.TxOut[contractOut].Value - int64(fee)
	if txrules.IsDustOutput(redeemTx.TxOut[0], minFeePerKb) {
		panic(fmt.Errorf("redeem output value of %v is dust", diviutil.Amount(redeemTx.TxOut[0].Value)))
	}

	redeemSig, redeemPubKey, err := CreateSig(redeemTx, 0, contract, recipientAddr, client)
	if err != nil {
		return api.RedeemResponse{"", "", struct{}{}, nil, 51200}, err
	}
	redeemSigScript, err := RedeemP2SHContract(contract, redeemSig, redeemPubKey, secret)
	if err != nil {
		return api.RedeemResponse{"", "", struct{}{}, nil, 51200}, err
	}
	redeemTx.TxIn[0].SignatureScript = redeemSigScript

	redeemTxHash := redeemTx.TxHash()
	redeemFeePerKb := CalcFeePerKb(fee, redeemTx.SerializeSize())

	var buf bytes.Buffer
	buf.Grow(redeemTx.SerializeSize())
	redeemTx.Serialize(&buf)

	if autopublish == false {
		fmt.Printf("Redeem fee: %v (%0.8f BTC/kB)\n\n", fee, redeemFeePerKb)
		fmt.Printf("Redeem transaction (%v):\n", &redeemTxHash)
		fmt.Printf("%x\n\n", buf.Bytes())
	}

	if util.Verify {
		e, err := txscript.NewEngine(contractTx.TxOut[contractOutPoint.Index].PkScript,
			redeemTx, 0, txscript.StandardVerifyFlags, txscript.NewSigCache(10),
			txscript.NewTxSigHashes(redeemTx), contractTx.TxOut[contractOut].Value)
		if err != nil {
			panic(err)
		}
		err = e.Execute()
		if err != nil {
			panic(err)
		}
	}

	PromptPublishTx(client, redeemTx, "redeem", autopublish)

	return api.RedeemResponse{
		fee.String(),
		redeemTxHash.String(),
		struct{}{},
		nil,
		51200,
	}, nil
}
