// Package client provides the CLI specifications to interact with atomic swaps
package client

import (
	"atomic-swaps/src/swap"
	"atomic-swaps/src/util"
	"bytes"
	"encoding/hex"
	"errors"
	"fmt"

	"github.com/btcsuite/btcd/wire"
	"github.com/spf13/cobra"
)

// ExtractCommand : The extract command
// The extract command is how you can extract the secret hash by using the secret seed.
// Please note you will need the contract transaction bytes and the secret seed.
var ExtractCommand = &cobra.Command{
	Use:   "extract",
	Short: "extract the secret for an atomic swap. Usage: extract [contract transaction] [secret]",
	Args: func(cmd *cobra.Command, args []string) error {
		if len(args) < 2 {
			return errors.New("requires a redeeming transaction and a secret hash. Usage: extract [contract transaction] [secret]")
		}

		return nil
	},
	Run: func(cmd *cobra.Command, args []string) {
		contractTxBytes, _ := hex.DecodeString(args[0])
		secretHash, _ := hex.DecodeString(args[1])

		var contractTx wire.MsgTx
		err := contractTx.Deserialize(bytes.NewReader(contractTxBytes))

		if err != nil {
			fmt.Println(fmt.Errorf("failed to decode contract transaction: %v", err))
		}

		response, err := swap.Extract(contractTx, secretHash, util.UseCurrency, false)

		if err != nil {
			fmt.Println(err)
		}

		fmt.Println(response)
	},
}
