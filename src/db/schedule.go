// Package db provides the functions to interact with the atomic swaps MongoDB instance
package db

import (
	"atomic-swaps/src/swap"
	"atomic-swaps/src/util"
	"bytes"
	"encoding/hex"
	"fmt"

	"github.com/DiviProject/divid/chaincfg/chainhash"
	"github.com/DiviProject/divid/wire"
)

// Schedule : Loop through atomic swaps that are scheduled
// This function is passed to the "StartSchedule" function as a Lamda
func Schedule() {
	swaps, err := FindPending()

	if err != nil {
		fmt.Println(err)
	} else {
		for _, s := range swaps {
			baseHash, err := chainhash.NewHashFromStr(s.BaseTransaction)
			if err != nil {
				fmt.Println(err)
				continue
			}

			baseClient := swap.GetRPCClient("base")

			baseTx, err := baseClient.GetTransaction(baseHash)
			if err != nil {
				fmt.Println(err)
				continue
			}

			swapHash, err := chainhash.NewHashFromStr(s.SwapTransaction)
			if err != nil {
				fmt.Println(err)
				continue
			}

			swapClient := swap.GetRPCClient("swap")

			swapTx, err := swapClient.GetTransaction(swapHash)
			if err != nil {
				fmt.Println(err)
				continue
			}

			fmt.Println(baseTx.Confirmations, swapTx.Confirmations)

			if baseTx.Confirmations >= util.Configuration.BaseConfirmations && swapTx.Confirmations >= util.Configuration.SwapConfirmations {
				baseContract, err := hex.DecodeString(s.BaseContractBytes)
				if err != nil {
					fmt.Println(err)
					continue
				}

				baseTransactionBytes, err := hex.DecodeString(s.BaseTransactionBytes)
				if err != nil {
					fmt.Println(err)
					continue
				}

				var baseContractTransaction wire.MsgTx
				err = baseContractTransaction.Deserialize(bytes.NewReader(baseTransactionBytes))
				if err != nil {
					fmt.Println(err)
					continue
				}

				swapContract, err := hex.DecodeString(s.SwapContractBytes)
				if err != nil {
					fmt.Println(err)
					continue
				}

				swapTransactionBytes, err := hex.DecodeString(s.SwapTransactionBytes)
				if err != nil {
					fmt.Println(err)
					continue
				}

				var swapContractTransaction wire.MsgTx
				err = swapContractTransaction.Deserialize(bytes.NewReader(swapTransactionBytes))
				if err != nil {
					fmt.Println(err)
					continue
				}

				baseSecret, err := hex.DecodeString(s.Secret)
				if err != nil {
					fmt.Println(err)
					continue
				}

				baseResponse, err := swap.Redeem(baseContract, baseContractTransaction, baseSecret, "base", true)

				if err != nil {
					fmt.Println(err)
					continue
				}

				swapResponse, err := swap.Redeem(swapContract, swapContractTransaction, baseSecret, "swap", true)

				if err != nil {
					fmt.Println(err)
					continue
				}

				s.Status = "complete"
				s.BaseStatus = "complete"
				s.SwapStatus = "complete"

				s.BaseRedeemTransaction = baseResponse.GetRedeemTransaction()
				s.SwapRedeemTransaction = swapResponse.GetRedeemTransaction()

				Update(s)
			}
		}
	}
}
