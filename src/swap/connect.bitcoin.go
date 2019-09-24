// Package swap provides various key functions to execute an atomic swap
package swap

import (
	"atomic-swaps/src/chains"
	"github.com/DiviProject/divid/chaincfg"
)

// ReturnBitcoinConfig : Returns the Bitcoin network configuration
func ReturnBitcoinConfig(network string) *chaincfg.Params {
	if network == "mainnet" {
		return &chains.MainNetParams
	} else if network == "testnet" {
		return &chains.TestNet3Params
	} else {
		return &chains.RegressionNetParams
	}
}
