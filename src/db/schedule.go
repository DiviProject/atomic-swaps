// Package db provides the functions to interact with the atomic swaps MongoDB instance
package db

import (
	"atomic-swaps/src/swap"
	"bytes"
	"encoding/hex"
	"fmt"

	"github.com/btcsuite/btcd/chaincfg/chainhash"
	"github.com/btcsuite/btcd/wire"
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

			if baseTx.Confirmations > 1 && swapTx.Confirmations > 1 {
				baseContract, _ := hex.DecodeString(s.BaseContract)
				baseContractBytes, _ := hex.DecodeString(s.BaseTransactionBytes)
				baseSecret, _ := hex.DecodeString(s.Secret)

				var baseContractTransaction wire.MsgTx
				err := baseContractTransaction.Deserialize(bytes.NewReader(baseContractBytes))

				if err != nil {
					fmt.Println(err)
					continue
				}

				baseResponse, err := swap.Redeem(baseContract, baseContractTransaction, baseSecret, "base", true)

				if err != nil {
					fmt.Println(err)
					continue
				}

				swapResponse, err := swap.Redeem(baseContract, baseContractTransaction, baseSecret, "swap", true)

				if err != nil {
					fmt.Println(err)
					continue
				}

				s.Status = "complete"
				s.BaseStatus = "complete"
				s.SwapStatus = "complete"

				s.BaseRedeemTransaction = baseResponse.GetRedeemTransaction()
				s.SwapRedeemTransaction = swapResponse.GetRedeemTransaction()
			}
		}
	}
}
