// Package util provides various utility functions to execute atomic swaps
package util

import (
	"crypto/sha256"

	"github.com/DiviProject/divid/txscript"
	"github.com/DiviProject/divid/wire"
)

const (
	// RedeemAtomicSwapSigScriptSize : is the worst case (largest) serialize size
	// of a transaction input script to redeem the atomic swap contract.  This
	// does not include final push for the contract itself.
	//
	//   - OP_DATA_73
	//   - 72 bytes DER signature + 1 byte sighash
	//   - OP_DATA_33
	//   - 33 bytes serialized compressed pubkey
	//   - OP_DATA_32
	//   - 32 bytes secret
	//   - OP_TRUE
	RedeemAtomicSwapSigScriptSize = 1 + 73 + 1 + 33 + 1 + 32 + 1

	// RefundAtomicSwapSigScriptSize : is the worst case (largest) serialize size
	// of a transaction input script that refunds a P2SH atomic swap output.
	// This does not include final push for the contract itself.
	//
	//   - OP_DATA_73
	//   - 72 bytes DER signature + 1 byte sighash
	//   - OP_DATA_33
	//   - 33 bytes serialized compressed pubkey
	//   - OP_FALSE
	RefundAtomicSwapSigScriptSize = 1 + 73 + 1 + 33 + 1
)

// SumOutputSerializeSizes : Get sum of inputs
func SumOutputSerializeSizes(outputs []*wire.TxOut) (serializeSize int) {
	for _, txOut := range outputs {
		serializeSize += txOut.SerializeSize()
	}
	return serializeSize
}

// InputSize : returns the size of the transaction input needed to include a
// signature script with size sigScriptSize.  It is calculated as:
//
//   - 32 bytes previous tx
//   - 4 bytes output index
//   - Compact int encoding sigScriptSize
//   - sigScriptSize bytes signature script
//   - 4 bytes sequence
func InputSize(sigScriptSize int) int {
	return 32 + 4 + wire.VarIntSerializeSize(uint64(sigScriptSize)) + sigScriptSize + 4
}

// EstimateRedeemSerializeSize : returns a worst case serialize size estimates for
// a transaction that redeems an atomic swap P2SH output.
func EstimateRedeemSerializeSize(contract []byte, txOuts []*wire.TxOut) int {
	contractPush, err := txscript.NewScriptBuilder().AddData(contract).Script()
	if err != nil {
		// Should never be hit since this script does exceed the limits.
		panic(err)
	}
	contractPushSize := len(contractPush)

	// 12 additional bytes are for version, locktime and expiry.
	return 12 + wire.VarIntSerializeSize(1) +
		wire.VarIntSerializeSize(uint64(len(txOuts))) +
		InputSize(RedeemAtomicSwapSigScriptSize+contractPushSize) +
		SumOutputSerializeSizes(txOuts)
}

// EstimateRefundSerializeSize : returns a worst case serialize size estimates for
// a transaction that refunds an atomic swap P2SH output.
func EstimateRefundSerializeSize(contract []byte, txOuts []*wire.TxOut) int {
	contractPush, err := txscript.NewScriptBuilder().AddData(contract).Script()
	if err != nil {
		// Should never be hit since this script does exceed the limits.
		panic(err)
	}
	contractPushSize := len(contractPush)

	// 12 additional bytes are for version, locktime and expiry.
	return 12 + wire.VarIntSerializeSize(1) +
		wire.VarIntSerializeSize(uint64(len(txOuts))) +
		InputSize(RefundAtomicSwapSigScriptSize+contractPushSize) +
		SumOutputSerializeSizes(txOuts)
}

// GenerateSHA256 : Generates a SHA 256 hash
func GenerateSHA256(x []byte) []byte {
	h := sha256.Sum256(x)
	return h[:]
}
