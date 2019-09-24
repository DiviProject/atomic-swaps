// Package swap provides various key functions to execute an atomic swap
package swap

import (
	"atomic-swaps/src/api"

	"bytes"
	"errors"
	"fmt"

	"github.com/btcsuite/btcd/txscript"
	"github.com/btcsuite/btcd/wire"
)

// Refund : The refund command
// The refund command requires the contract transaction bytes
// It will return the funds to the original address (minus the relay fee)
func Refund(contract []byte, contractTx wire.MsgTx, currency string, autopublish bool) (api.RefundResponse, error) {
	client := GetRPCClient(currency)

	defer func() {
		client.Shutdown()
		client.WaitForShutdown()
	}()

	pushes, err := txscript.ExtractAtomicSwapDataPushes(0, contract)
	if err != nil {
		return api.RefundResponse{"", "", struct{}{}, nil, 51200}, err
	}
	if pushes == nil {
		return api.RefundResponse{"", "", struct{}{}, nil, 51200}, errors.New("contract is not an atomic swap script recognized by this tool")
	}

	feePerKb, minFeePerKb, err := GetFees(client)
	if err != nil {
		return api.RefundResponse{"", "", struct{}{}, nil, 51200}, err
	}

	refundTx, refundFee, err := BuildRefund(client, contract, &contractTx, feePerKb, minFeePerKb, currency)
	if err != nil {
		return api.RefundResponse{"", "", struct{}{}, nil, 51200}, err
	}
	refundTxHash := refundTx.TxHash()
	var buf bytes.Buffer
	buf.Grow(refundTx.SerializeSize())
	refundTx.Serialize(&buf)

	refundFeePerKb := CalcFeePerKb(refundFee, refundTx.SerializeSize())

	fmt.Printf("Refund fee: %v (%0.8f BTC/kB)\n\n", refundFee, refundFeePerKb)
	fmt.Printf("Refund transaction (%v):\n", &refundTxHash)
	fmt.Printf("%x\n\n", buf.Bytes())

	PromptPublishTx(client, refundTx, "refund", autopublish)

	return api.RefundResponse{
		refundFee.String(),
		refundTxHash.String(),
		struct{}{},
		nil,
		51200,
	}, nil
}
