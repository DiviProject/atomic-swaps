// Package client provides the CLI specifications to interact with atomic swaps
package client

import (
	"fmt"

	"github.com/spf13/cobra"
)

// VersionCommand : The version command
// This prints the current version of atomic swaps that you are using.
var VersionCommand = &cobra.Command{
	Use:   "version",
	Short: "print the version of atomicswap",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("atomicswap RC1.0.0")
	},
}
