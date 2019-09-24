// Package swap provides various key functions to execute an atomic swap
package swap

import (
	"fmt"
	"net"
	"strconv"

	"atomic-swaps/src/util"

	"github.com/btcsuite/btcd/chaincfg"
	rpcd "github.com/btcsuite/btcd/rpcclient"
)

// RetrieveNetwork : Get the network configuration for the base or swap currency
func RetrieveNetwork(currency string) *chaincfg.Params {
	if currency == "base" {
		if util.Configuration.BaseCurrency == "bitcoin" || util.Configuration.BaseCurrency == "btc" {
			return ReturnBitcoinConfig(util.Configuration.BaseRPCNetwork)
		} else if util.Configuration.BaseCurrency == "Divi" || util.Configuration.BaseCurrency == "divi" {
			return ReturnDiviConfig(util.Configuration.BaseRPCNetwork)
		}
	} else {
		if util.Configuration.BaseCurrency == "bitcoin" || util.Configuration.BaseCurrency == "btc" {
			return ReturnBitcoinConfig(util.Configuration.SwapRPCNetwork)
		} else if util.Configuration.BaseCurrency == "Divi" || util.Configuration.BaseCurrency == "divi" {
			return ReturnDiviConfig(util.Configuration.SwapRPCNetwork)
		}
	}

	return nil
}

// ConfigureAddress : normalizes the address and port
func ConfigureAddress(address string, port int) string {
	return net.JoinHostPort(address, strconv.Itoa(port))
}

// GetRPCClient : Gets the RPC Client for requests
// This is the standard RPC for bitcoin clients
// You can toggle between use the base or swap RPC specs with the "UseCurrency command"
func GetRPCClient(currency string) *rpcd.Client {
	if currency == "base" {
		RPCAddress := ConfigureAddress(util.Configuration.BaseRPCHost, util.Configuration.BaseRPCPort)
		RPCConnection := &rpcd.ConnConfig{
			Host:         RPCAddress,
			User:         util.Configuration.BaseRPCUser,
			Pass:         util.Configuration.BaseRPCPassword,
			DisableTLS:   true,
			HTTPPostMode: true,
		}

		client, err := rpcd.New(RPCConnection, nil)
		if err != nil {
			fmt.Println(err)
		}

		return client
	} else {
		RPCAddress := ConfigureAddress(util.Configuration.SwapRPCHost, util.Configuration.SwapRPCPort)
		RPCConnection := &rpcd.ConnConfig{
			Host:         RPCAddress,
			User:         util.Configuration.SwapRPCUser,
			Pass:         util.Configuration.SwapRPCPassword,
			DisableTLS:   true,
			HTTPPostMode: true,
		}

		client, err := rpcd.New(RPCConnection, nil)
		if err != nil {
			fmt.Println(err)
		}

		return client
	}
}
