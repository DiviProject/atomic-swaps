// Package swap provides various key functions to execute an atomic swap
package swap

import (
	"atomic-swaps/src/divichain"

	"github.com/btcsuite/btcd/chaincfg"
)

// ReturnDiviConfig : Returns the Bitcoin network configuration
func ReturnDiviConfig(network string) *chaincfg.Params {
	if network == "mainnet" {
		return &divichain.MainNetParams
	} else if network == "testnet" {
		return &divichain.TestNet3Params
	} else {
		return &divichain.RegressionNetParams
	}
}
