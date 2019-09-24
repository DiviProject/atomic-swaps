// Package swap provides various key functions to execute an atomic swap
package swap

import (
	"github.com/btcsuite/btcd/chaincfg"
)

// ReturnBitcoinConfig : Returns the Bitcoin network configuration
func ReturnBitcoinConfig(network string) *chaincfg.Params {
	if network == "mainnet" {
		return &chaincfg.MainNetParams
	} else if network == "testnet" {
		return &chaincfg.TestNet3Params
	} else {
		return &chaincfg.RegressionNetParams
	}
}
