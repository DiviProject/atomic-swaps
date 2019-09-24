// Package swap provides various key functions to execute an atomic swap
package swap

import (
	"atomic-swaps/src/api"
	"atomic-swaps/src/util"
	"bytes"
	"errors"
	"fmt"
	"time"

	"github.com/btcsuite/btcd/txscript"
	"github.com/btcsuite/btcd/wire"
	"github.com/btcsuite/btcutil"
)

// Audit : The audit command
// Auditing a contract will output the related data in regards to an atomic swap
// It verifies whether or not an atomic swap contract is valid and outputs related information
func Audit(contract []byte, contractTx wire.MsgTx, currency string, autopublish bool) (api.AuditResponse, error) {
	network := RetrieveNetwork(currency)

	contractHash160 := btcutil.Hash160(contract)
	contractOut := -1
	for i, out := range contractTx.TxOut {
		sc, addrs, _, err := txscript.ExtractPkScriptAddrs(out.PkScript, network)
		if err != nil || sc != txscript.ScriptHashTy {
			continue
		}
		if bytes.Equal(addrs[0].(*btcutil.AddressScriptHash).Hash160()[:], contractHash160) {
			contractOut = i
			break
		}
	}
	if contractOut == -1 {
		return api.AuditResponse{"", "", "", "", "", "", struct{}{}, nil, 51200}, errors.New("transaction does not contain the contract output")
	}

	pushes, err := txscript.ExtractAtomicSwapDataPushes(0, contract)
	if err != nil {
		return api.AuditResponse{"", "", "", "", "", "", struct{}{}, nil, 51200}, err
	}
	if pushes == nil {
		return api.AuditResponse{"", "", "", "", "", "", struct{}{}, nil, 51200}, errors.New("contract is not an atomic swap script recognized by this tool")
	}
	if pushes.SecretSize != util.SecretSize {
		return api.AuditResponse{"", "", "", "", "", "", struct{}{}, nil, 51200}, fmt.Errorf("contract specifies strange secret size %v", pushes.SecretSize)
	}

	contractAddr, err := btcutil.NewAddressScriptHash(contract, network)
	if err != nil {
		return api.AuditResponse{"", "", "", "", "", "", struct{}{}, nil, 51200}, err
	}
	recipientAddr, err := btcutil.NewAddressPubKeyHash(pushes.RecipientHash160[:], network)
	if err != nil {
		return api.AuditResponse{"", "", "", "", "", "", struct{}{}, nil, 51200}, err
	}
	refundAddr, err := btcutil.NewAddressPubKeyHash(pushes.RefundHash160[:], network)
	if err != nil {
		return api.AuditResponse{"", "", "", "", "", "", struct{}{}, nil, 51200}, err
	}

	fmt.Printf("Contract address:        %v\n", contractAddr)
	fmt.Printf("Contract value:          %v\n", btcutil.Amount(contractTx.TxOut[contractOut].Value))
	fmt.Printf("Recipient address:       %v\n", recipientAddr)
	fmt.Printf("Author's refund address: %v\n\n", refundAddr)

	fmt.Printf("Secret hash: %x\n\n", pushes.SecretHash[:])

	if pushes.LockTime >= int64(txscript.LockTimeThreshold) {
		t := time.Unix(pushes.LockTime, 0)
		fmt.Printf("Locktime: %v\n", t.UTC())
		reachedAt := time.Until(t).Truncate(time.Second)
		if reachedAt > 0 {
			fmt.Printf("Locktime reached in %v\n", reachedAt)
		} else {
			fmt.Printf("Contract refund time lock has expired\n")
		}
	} else {
		fmt.Printf("Locktime: block %v\n", pushes.LockTime)
	}

	return api.AuditResponse{
		contractAddr.String(),
		fmt.Sprintf("%x", contractTx.TxOut[contractOut].Value),
		recipientAddr.String(),
		refundAddr.String(),
		fmt.Sprintf("%x", pushes.SecretHash[:]),
		fmt.Sprintf("%x", pushes.LockTime),
		struct{}{},
		nil,
		51200,
	}, nil
}
