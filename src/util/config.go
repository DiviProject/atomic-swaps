// Package util provides various utility functions to execute atomic swaps
package util

import (
	"fmt"
	"io/ioutil"

	"encoding/json"

	"go.mongodb.org/mongo-driver/mongo"
)

// Config : Configuration sturct for the project
// This includes the RPC configuration (host, port, user, password)
// The currencies to swap between
// The network configuration (mainnet, testnet, regtest)
// As well as specifications for running the HTTP and GRPC servers
type Config struct {
	// Base Currency RPC Configuration
	BaseCurrency    string `json:"base-currency"`
	BaseRPCHost     string `json:"base-rpc-host"`
	BaseRPCPort     int    `json:"base-rpc-port"`
	BaseRPCUser     string `json:"base-rpc-user"`
	BaseRPCPassword string `json:"base-rpc-password"`
	BaseRPCNetwork  string `json:"base-rpc-network"`
	// Swap Currency RPC Configuration
	SwapCurrency    string `json:"swap-currency"`
	SwapRPCHost     string `json:"swap-rpc-host"`
	SwapRPCPort     int    `json:"swap-rpc-port"`
	SwapRPCUser     string `json:"swap-rpc-user"`
	SwapRPCPassword string `json:"swap-rpc-password"`
	SwapRPCNetwork  string `json:"swap-rpc-network"`
	// Server Configuration
	MongoURL   string `json:"mongodb"`
	Database   string `json:"database"`
	ServerPort int    `json:"server-port"`
	GRPCPort   int    `json:"grpc-port"`
}

// Configure : Reads configuration from a json file and returns a Config object
// You can reference https://github.com/DiviProject/atomic-swaps/src/blob/master/.atomicswap.json to learn how to write your own configuration file.
func Configure(path string) Config {
	var config Config

	file, err := ioutil.ReadFile(path)
	if err != nil {
		fmt.Println("Could not find an atomicswap config file")
	}

	if err == nil {
		err = json.Unmarshal(file, &config)
		if err != nil {
			fmt.Println("There were issues parsing the atomicswap config file")
		}
	}

	return config
}

// Configuration : The global configuration file
// This automatically uses the Config struct
var Configuration Config

// ConfigPath : The path of the configuration path
// By default this will be empty and will use the default configuration specified by the client.
var ConfigPath string

// UseCurrency : Which currency to use (base or swap)
// You can choose between two currencies, base or swap. It will select each respective RPC specs when executing atomic swaps.
// The default will be the "base" currency. But you can switch it with --use-base or --use-swap
var UseCurrency string = "base"

// MongoDB : The MongoDB Client
var MongoDB *mongo.Client

// MongoTable : The table to insert data into
var MongoTable string = "atomicswaps"
