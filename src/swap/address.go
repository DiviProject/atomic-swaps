// Package swap provides various key functions to execute an atomic swap
package swap

import (
	"encoding/json"
	"fmt"

	rpcd "github.com/btcsuite/btcd/rpcclient"
	"github.com/btcsuite/btcd/txscript"
	"github.com/btcsuite/btcd/wire"
	"github.com/btcsuite/btcutil"
)

// RawChangeAddress : retrieves a legacy bitcoin address from the RPC
// Please note the address retrieved must be from the current network
// This can be configured by setting the `mainnet` `testnet` and `regtest` configuration
func RawChangeAddress(c *rpcd.Client, currency string) (btcutil.Address, error) {
	network := RetrieveNetwork(currency)

	params := []json.RawMessage{[]byte(`"legacy"`)}
	rawResp, err := c.RawRequest("getrawchangeaddress", params)
	if err != nil {
		return nil, err
	}

	var addrStr string
	err = json.Unmarshal(rawResp, &addrStr)
	if err != nil {
		return nil, err
	}

	addr, err := btcutil.DecodeAddress(addrStr, network)
	if err != nil {
		return nil, err
	}

	if !addr.IsForNet(network) {
		return nil, fmt.Errorf("address %v is not intended for use on %v", addrStr, network.Name)
	}

	if _, ok := addr.(*btcutil.AddressPubKeyHash); !ok {
		return nil, fmt.Errorf("getrawchangeaddress: address %v is not P2PKH", addr)
	}

	return addr, nil
}

// CreateSig : Create a transaction signature
// This create a secure signature for a transaction bytes
// It encrypts it with the associated address' private key
func CreateSig(tx *wire.MsgTx, idx int, pkScript []byte, addr btcutil.Address, c *rpcd.Client) (sig, pubkey []byte, err error) {

	wif, err := c.DumpPrivKey(addr)
	if err != nil {
		return nil, nil, err
	}
	sig, err = txscript.RawTxInSignature(tx, idx, pkScript, txscript.SigHashAll, wif.PrivKey)
	if err != nil {
		return nil, nil, err
	}
	return sig, wif.PrivKey.PubKey().SerializeCompressed(), nil
}
