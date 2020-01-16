// Package client provides the CLI specifications to interact with atomic swaps
package client

import (
	"fmt"
	"os"

	"atomic-swaps/src/db"
	"atomic-swaps/src/swap"
	"atomic-swaps/src/util"
)

// CLI : This function sets up and configures the atomic swaps application.
// This function can accept flags from the command line.
// It can also accept a configuration file, see: https://github.com/DiviProject/atomic-swaps/src/blob/master/.atomicswap.json as a reference.
// It also hooks up the commands that can be used, which includes running this as a gRPC server.
func CLI() {
	// Get the Configuration file
	CommandConfig.PersistentFlags().StringVarP(&util.ConfigPath, "config", "c", "", "the path to the Configuration file")

	// Initialize Configuration
	if util.ConfigPath != "" {
		util.Configuration = util.Configure(util.ConfigPath)
	} else {
		// Base Currency Wallet RPC flags
		CommandConfig.PersistentFlags().StringVar(&util.Configuration.BaseCurrency, "base-rpc-currency", "bitcoin", "the base currency")
		CommandConfig.PersistentFlags().StringVar(&util.Configuration.BaseRPCHost, "base-rpc-host", "localhost", "the base currency host of the wallet RPC server")
		CommandConfig.PersistentFlags().IntVar(&util.Configuration.BaseRPCPort, "base-rpc-port", 1337, "the base currency port of the wallet RPC server")
		CommandConfig.PersistentFlags().StringVar(&util.Configuration.BaseRPCUser, "base-rpc-user", "user", "the base currency user of the wallet RPC server")
		CommandConfig.PersistentFlags().StringVar(&util.Configuration.BaseRPCPassword, "base-rpc-password", "password", "the base currency password of the wallet RPC server")
		CommandConfig.PersistentFlags().StringVar(&util.Configuration.BaseRPCNetwork, "base-rpc-network", "regtest", "the base network configuration")

		// Swap Currency Wallet RPC flags
		CommandConfig.PersistentFlags().StringVar(&util.Configuration.SwapCurrency, "swap-rpc-currency", "divi", "the swap currency")
		CommandConfig.PersistentFlags().StringVar(&util.Configuration.SwapRPCHost, "swap-rpc-host", "localhost", "the swap currency host of the wallet RPC server")
		CommandConfig.PersistentFlags().IntVar(&util.Configuration.SwapRPCPort, "swap-rpc-port", 1337, "the swap currency port of the wallet RPC server")
		CommandConfig.PersistentFlags().StringVar(&util.Configuration.SwapRPCUser, "swap-rpc-user", "user", "the swap currency user of the wallet RPC server")
		CommandConfig.PersistentFlags().StringVar(&util.Configuration.SwapRPCPassword, "swap-rpc-password", "password", "the swap currency password of the wallet RPC server")
		CommandConfig.PersistentFlags().StringVar(&util.Configuration.SwapRPCNetwork, "swap-rpc-network", "regtest", "the swap network configuration")

		// Server flags
		CommandConfig.PersistentFlags().IntVarP(&util.Configuration.ServerPort, "server-port", "", 9001, "the port of the HTTP server")
		CommandConfig.PersistentFlags().IntVarP(&util.Configuration.GRPCPort, "grpc-port", "", 9999, "the port of the gRPC server (raw tcp)")

		//MongoDB Flags
		CommandConfig.PersistentFlags().StringVar(&util.Configuration.MongoURL, "mongo-url", "mongodb://localhost:27017", "the url for the MongoDB service")
		CommandConfig.PersistentFlags().StringVar(&util.Configuration.Database, "database", "atomic-swaps", "the default mongo database")

		// Command line configuration flags
		CommandConfig.PersistentFlags().BoolVarP(&swap.Prompt, "no-prompt", "y", false, "do not prompt transactions with a y/n")
		CommandConfig.PersistentFlags().StringVar(&util.UseCurrency, "use-base", "base", "Use the base currency RPC specs for the CLI command, default is base")
		CommandConfig.PersistentFlags().StringVar(&util.UseCurrency, "use-swap", "swap", "Use the swap currency RPC specs for the CLI command, default is base")
	}

	db.Init(util.Configuration.MongoURL)
	go db.StartSchedule(db.Schedule)

	// Add usable commands
	CommandConfig.AddCommand(VersionCommand)
	CommandConfig.AddCommand(InitiateCommand)
	CommandConfig.AddCommand(ParticipateCommand)
	CommandConfig.AddCommand(RedeemCommand)
	CommandConfig.AddCommand(RefundCommand)
	CommandConfig.AddCommand(ExtractCommand)
	CommandConfig.AddCommand(AuditCommand)

	err := CommandConfig.Execute()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
