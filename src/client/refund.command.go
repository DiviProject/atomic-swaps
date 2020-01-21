// Package client provides the CLI specifications to interact with atomic swaps
package client

import (
	"atomic-swaps/src/swap"
	"atomic-swaps/src/util"
	"bytes"
	"encoding/hex"
	"errors"
	"fmt"

	"github.com/DiviProject/divid/wire"
	"github.com/spf13/cobra"
)

// RefundCommand : The refund command
// The refund command is how you can refund an atomic swap via the command line
// You will need the contract bytes and the contract transaction bytes to refund an atomic swap
var RefundCommand = &cobra.Command{
	Use:   "refund",
	Short: "refund an atomic swap. Usage: refund [contract] [contract transaction]",
	Args: func(cmd *cobra.Command, args []string) error {
		if len(args) < 2 {
			return errors.New("requires a contract and contract transaction. Usage: refund [contract] [contract transaction]")
		}

		return nil
	},
	Run: func(cmd *cobra.Command, args []string) {
		contract, _ := hex.DecodeString(args[0])
		contractTxBytes, _ := hex.DecodeString(args[1])

		var contractTx wire.MsgTx
		err := contractTx.Deserialize(bytes.NewReader(contractTxBytes))

		if err != nil {
			fmt.Println(fmt.Errorf("failed to decode contract transaction: %v", err))
		}

		_, err = swap.Refund(contract, contractTx, util.UseCurrency, false)

		if err != nil {
			fmt.Println(err)
		}
	},
}
