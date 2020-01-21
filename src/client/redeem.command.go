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

// RedeemCommand : The redeem command
// The redeem command is how you can participate in an atomic swap via the command line.
// Please note that you need the secret from the original atomic swap.
// You will also need the contract bytes and the contract transaction bytes.
var RedeemCommand = &cobra.Command{
	Use:   "redeem",
	Short: "redeem an atomic swap. Usage: redeem [contract] [contract transaction] [secret]",
	Args: func(cmd *cobra.Command, args []string) error {
		if len(args) < 3 {
			return errors.New("requires a contact, a contract transaction and a secret address. Usage: redeem [contract] [contract transaction] [secret]")
		}

		return nil
	},
	Run: func(cmd *cobra.Command, args []string) {
		contract, _ := hex.DecodeString(args[0])
		contractTxBytes, _ := hex.DecodeString(args[1])
		secret, _ := hex.DecodeString(args[2])

		var contractTx wire.MsgTx
		err := contractTx.Deserialize(bytes.NewReader(contractTxBytes))

		if err != nil {
			fmt.Println(fmt.Errorf("failed to decode contract transaction: %v", err))
		}

		_, err = swap.Redeem(contract, contractTx, secret, util.UseCurrency, false)

		if err != nil {
			fmt.Println(err)
		}
	},
}
