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

// AuditCommand : The audit command
// The audit command is how you can audit the transaction and verify that it's a valid atomic swap transaction.
// Please note that you will need the contract bytes and the contract transaction bytes.
var AuditCommand = &cobra.Command{
	Use:   "audit",
	Short: "audit and validate an existing atomic swap contract. Usage: audit [contract] [contract transaction]",
	Args: func(cmd *cobra.Command, args []string) error {
		if len(args) < 2 {
			return errors.New("requires a contract and a contract transaction. Usage: audit [contract] [contract transaction]")
		}

		return nil
	},
	Run: func(cmd *cobra.Command, args []string) {
		contractHash, _ := hex.DecodeString(args[1])
		contractTxBytes, _ := hex.DecodeString(args[0])

		var contractTx wire.MsgTx
		err := contractTx.Deserialize(bytes.NewReader(contractTxBytes))

		if err != nil {
			fmt.Println(fmt.Errorf("failed to decode contract transaction: %v", err))
		}

		_, err = swap.Audit(contractHash, contractTx, util.UseCurrency, false)

		if err != nil {
			fmt.Println(err)
		}
	},
}
