// Package db provides the functions to interact with the atomic swaps MongoDB instance
package db

import (
	"atomic-swaps/src/swap"
	"encoding/hex"
	"strconv"
)

// ScheduleSwap : Schedule an atomic swap
func ScheduleSwap(baseAmount string, baseAddress string, swapAmount string, swapAddress string) (string, error) {
	var Document AtomicSwap

	initAmount, err := strconv.ParseFloat(baseAmount, 64)
	init, err := swap.Initiate(swapAddress, initAmount, "base", true)

	if err != nil {
		return "", err
	}

	participateAmount, err := strconv.ParseFloat(swapAmount, 64)
	secret, err := hex.DecodeString(init.SecretHash)
	participate, err := swap.Participate(baseAddress, participateAmount, secret, "swap", true)

	if err != nil {
		return "", err
	}

	Document.Status = "pending"
	Document.BaseStatus = "pending"
	Document.SwapStatus = "pending"
	Document.Secret = init.GetSecret()
	Document.BaseAmount = baseAmount
	Document.BaseAddress = baseAddress
	Document.SwapAmount = swapAmount
	Document.SwapAddress = swapAddress
	Document.BaseContract = init.GetContractAddress()
	Document.SwapContract = participate.GetContract()
	Document.BaseContractBytes = init.GetContractBytes()
	Document.SwapContractBytes = participate.GetContractBytes()
	Document.BaseTransaction = init.GetContractTransaction()
	Document.SwapTransaction = participate.GetContractTransaction()
	Document.BaseTransactionBytes = init.GetContractTransactionBytes()
	Document.SwapTransactionBytes = participate.GetContractTransactionBytes()
	Document.BaseRefund = init.GetContractRefund()
	Document.SwapRefund = participate.GetRefundTransaction()
	Document.BaseFee = init.GetContractFee()
	Document.SwapFee = participate.GetContractFee()
	Document.BaseRefundFee = init.GetRefundFee()
	Document.SwapRefundFee = participate.GetRefundFee()

	DocumentID, err := Insert(Document)

	if err != nil {
		return "", err
	}

	return DocumentID, nil
}
