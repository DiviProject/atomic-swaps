// Package util provides various utility functions to execute atomic swaps
package util

// TXVersion : Which version the UTXO is formatted in
const TXVersion int32 = 2

// SecretSize : The size of each secret hash in bytes
const SecretSize int64 = 32

// Verify : Whether or not you must verify contracts before redeeming them
const Verify bool = true
