// Package swap provides various key functions to execute an atomic swap
package swap

import (
	"github.com/DiviProject/divid/chaincfg"
)

// ReturnDiviConfig : Returns the Divi network configuration
func ReturnDiviConfig(network string) *chaincfg.Params {
	if network == "mainnet" {
		return &chaincfg.MainNetParams
	} else if network == "testnet" {
		return &chaincfg.TestNet3Params
	} else {
		return &chaincfg.RegressionNetParams
	}
}
