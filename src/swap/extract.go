// Package swap provides various key functions to execute an atomic swap
package swap

import (
	"atomic-swaps/src/api"
	"atomic-swaps/src/util"
	"bytes"
	"fmt"

	"github.com/btcsuite/btcd/txscript"
	"github.com/btcsuite/btcd/wire"
)

// Extract : The Extract Command
// The extract command loops through the bytes in order to return the secret hash in hexadecimal format
func Extract(contract wire.MsgTx, secret []byte, currency string, autopublish bool) (api.ExtractResponse, error) {
	var s string
	for _, in := range contract.TxIn {
		pushes, err := txscript.PushedData(in.SignatureScript)
		if err != nil {
			return api.ExtractResponse{"", struct{}{}, nil, 51200}, err
		}
		for _, push := range pushes {
			if bytes.Equal(util.GenerateSHA256(push), secret) {
				if !autopublish {
					fmt.Printf("Secret: %x\n", push)
				}
				s = fmt.Sprintf("%x", push)
			}
		}
	}

	return api.ExtractResponse{
		s,
		struct{}{},
		nil,
		51200,
	}, nil
}
