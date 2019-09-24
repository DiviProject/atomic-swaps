// Package client provides the CLI specifications to interact with atomic swaps
package client

import (
	"strconv"

	"atomic-swaps/src/rpc"
	"atomic-swaps/src/util"

	"github.com/spf13/cobra"
)

// CommandConfig : The default CLI command
// By default, if no specific command is verbosely specified. Atomic Swaps will run in server mode.
// This will set up both the gRPC and HTTP server.
var CommandConfig = &cobra.Command{
	Use:   "atomicswap",
	Short: "Atomic Swaps by Divi",
	Long:  `A fast and easy way to do atomic swaps for Divi and Bitcoin. Learn more at https://github.com/DiviProject/atomic-swaps`,
	Run: func(cmd *cobra.Command, args []string) {
		util.Parallel(
			func() {
				rpc.StartGRPCServer(strconv.Itoa(util.Configuration.GRPCPort))
			},
			func() {
				rpc.StartHTTPServer(strconv.Itoa(util.Configuration.GRPCPort), strconv.Itoa(util.Configuration.ServerPort))
			},
		)
	},
}
