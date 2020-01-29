// Package client provides the CLI specifications to interact with atomic swaps
package client

import (
	"atomic-swaps/src/swap"
	"atomic-swaps/src/util"
	"encoding/hex"
	"errors"
	"fmt"
	"strconv"

	"github.com/spf13/cobra"
)

// ParticipateCommand : The participate command
// The participate command is how you can participate in an atomic swap via command line.
// Please note that you will need the secret from the original atomic swap.
// As well as your address and the amount you want to participate with too.
// The initiator's address must be the same as the underlying currency specified. If participating a swap on Bitcoin.
// The address must be a BTC address. If participating in a swap on Divi. The address must be a Divi address.
var ParticipateCommand = &cobra.Command{
	Use:   "participate",
	Short: "participate in an atomic swap. Usage: participate [initiator's address] [amount] [secret]",
	Args: func(cmd *cobra.Command, args []string) error {
		if len(args) < 3 {
			return errors.New("requires an initiator's address (in the same underlying currency), an amount and a secret address. Usage: participate [initiator's address] [amount] [secret]")
		}

		return nil
	},
	Run: func(cmd *cobra.Command, args []string) {
		address := args[0]
		amount, err := strconv.ParseFloat(args[1], 64)
		secret, _ := hex.DecodeString(args[2])

		if err != nil {
			fmt.Println(err)
		}

		_, err = swap.Participate(address, amount, secret, util.UseCurrency, false)

		if err != nil {
			fmt.Println(err)
		}
	},
}
