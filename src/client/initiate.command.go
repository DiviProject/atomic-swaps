// Package client provides the CLI specifications to interact with atomic swaps
package client

import (
	"atomic-swaps/src/swap"
	"atomic-swaps/src/util"
	"errors"
	"fmt"
	"strconv"

	"github.com/spf13/cobra"
)

// InitiateCommand : The initiate command
// The initiate command is how you can initiate an atomic swap via command line.
// Please note that you need access to an RPC server and also need to specify the address and the amount.
// The participant's address must be the same as the underlying currency specified. If initiating a swap on Bitcoin.
// The address must be a BTC address. If initiating a swap on Divi. The address must be a Divi address.
var InitiateCommand = &cobra.Command{
	Use:   "initiate",
	Short: "initiate an atomic swap. Usage: initiate [participant's address] [amount]",
	Args: func(cmd *cobra.Command, args []string) error {
		if len(args) < 2 {
			return errors.New("requires the participant's address (in the same underlying currency) and an amount. Usage: initiate [participant's address] [amount]")
		}

		return nil
	},
	Run: func(cmd *cobra.Command, args []string) {
		address := args[0]
		amount, err := strconv.ParseFloat(args[1], 64)

		if err != nil {
			fmt.Println(err)
		}

		_, err = swap.Initiate(address, amount, util.UseCurrency, false)

		if err != nil {
			fmt.Println(err)
		}
	},
}
