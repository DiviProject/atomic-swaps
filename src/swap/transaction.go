// Package swap provides various key functions to execute an atomic swap
package swap

import (
	"bufio"
	"bytes"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"github.com/DiviProject/divid/chaincfg/chainhash"
	rpcd "github.com/DiviProject/divid/rpcclient"
	"github.com/DiviProject/divid/txscript"
	"github.com/DiviProject/divid/wire"
	"github.com/DiviProject/diviutil"
)

var Prompt bool = false

// SendRawTransaction : Send a raw transaction to the RPC
// This will just take the transaction bytes (from build.go) and send it to the RPC client
func SendRawTransaction(c *rpcd.Client, tx *wire.MsgTx) (*chainhash.Hash, error) {
	var buf bytes.Buffer
	buf.Grow(tx.SerializeSize())
	tx.Serialize(&buf)

	param, err := json.Marshal(hex.EncodeToString(buf.Bytes()))
	if err != nil {
		return nil, err
	}
	hex, err := c.RawRequest("sendrawtransaction", []json.RawMessage{param})
	if err != nil {
		return nil, err
	}
	s := string(hex)
	// we need to remove quotes from the json response
	s = s[1 : len(s)-1]
	hash, err := chainhash.NewHashFromStr(s)
	if err != nil {
		return nil, err
	}

	return hash, nil
}

// FundTransaction : Funds the transaction
// This provides funds to mine a transaction
func FundTransaction(c *rpcd.Client, tx *wire.MsgTx, feePerKb diviutil.Amount) (fundedTx *wire.MsgTx, fee diviutil.Amount, err error) {
	var buf bytes.Buffer
	buf.Grow(tx.SerializeSize())
	tx.Serialize(&buf)
	param0, err := json.Marshal(hex.EncodeToString(buf.Bytes()))
	if err != nil {
		return nil, 0, err
	}
	param1, err := json.Marshal(struct {
		FeeRate float64 `json:"feeRate"`
	}{
		FeeRate: feePerKb.ToDIVI(),
	})
	if err != nil {
		return nil, 0, err
	}
	params := []json.RawMessage{param0, param1}
	rawResp, err := c.RawRequest("fundrawtransaction", params)
	if err != nil {
		return nil, 0, err
	}
	var resp struct {
		Hex       string  `json:"hex"`
		Fee       float64 `json:"fee"`
		ChangePos float64 `json:"changepos"`
	}
	err = json.Unmarshal(rawResp, &resp)
	if err != nil {
		return nil, 0, err
	}
	fundedTxBytes, err := hex.DecodeString(resp.Hex)
	if err != nil {
		return nil, 0, err
	}
	fundedTx = &wire.MsgTx{}
	err = fundedTx.Deserialize(bytes.NewReader(fundedTxBytes))
	if err != nil {
		return nil, 0, err
	}
	feeAmount, err := diviutil.NewAmount(resp.Fee)
	if err != nil {
		return nil, 0, err
	}
	return fundedTx, feeAmount, nil
}

// SignTransaction : Signs and confirms the transaction
// Signing a transaction takes an addresses private key in order to allow a miner to verify and mine the transaction
func SignTransaction(c *rpcd.Client, tx *wire.MsgTx) (fundedTx *wire.MsgTx, complete bool, err error) {
	var buf bytes.Buffer
	buf.Grow(tx.SerializeSize())
	tx.Serialize(&buf)
	param, err := json.Marshal(hex.EncodeToString(buf.Bytes()))
	if err != nil {
		return nil, false, err
	}
	rawResp, err := c.RawRequest("signrawtransactionwithwallet", []json.RawMessage{param})
	if err != nil {
		return nil, false, err
	}
	var resp struct {
		Hex      string `json:"hex"`
		Complete bool   `json:"complete"`
	}
	err = json.Unmarshal(rawResp, &resp)
	if err != nil {
		return nil, false, err
	}
	fundedTxBytes, err := hex.DecodeString(resp.Hex)
	if err != nil {
		return nil, false, err
	}
	fundedTx = &wire.MsgTx{}
	err = fundedTx.Deserialize(bytes.NewReader(fundedTxBytes))
	if err != nil {
		return nil, false, err
	}
	return fundedTx, resp.Complete, nil
}

// PromptPublishTx : Prompt whether or not the transaction should be published
// This is simply just a Y/N prompt that only appears when using the CLI tool
// This is not prompted when using HTTP
func PromptPublishTx(c *rpcd.Client, tx *wire.MsgTx, name string, autopublish bool) error {
	reader := bufio.NewReader(os.Stdin)
	for {
		if !autopublish {
			if !Prompt {
				fmt.Printf("Publish %s transaction? [y/N] ", name)
				answer, err := reader.ReadString('\n')
				if err != nil {
					return err
				}
				answer = strings.TrimSpace(strings.ToLower(answer))

				switch answer {
				case "y", "yes":
				case "n", "no", "":
					return nil
				default:
					fmt.Println("please answer y or n")
					continue
				}
			}
		}

		txHash, err := SendRawTransaction(c, tx)
		if err != nil {
			return fmt.Errorf("sendrawtransaction: %v", err)
		}

		fmt.Printf("Published %s transaction (%v)\n", name, txHash)

		return nil
	}
}

// RedeemP2SHContract : returns the signature script to redeem a contract output
func RedeemP2SHContract(contract, sig, pubkey, secret []byte) ([]byte, error) {
	b := txscript.NewScriptBuilder()
	b.AddData(sig)
	b.AddData(pubkey)
	b.AddData(secret)
	b.AddInt64(1)
	b.AddData(contract)
	return b.Script()
}
