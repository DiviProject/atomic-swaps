// Package swap provides various key functions to execute an atomic swap
package swap

import (
	"encoding/json"
	"fmt"

	rpcd "github.com/DiviProject/divid/rpcclient"
	"github.com/DiviProject/divid/txscript"
	"github.com/DiviProject/divid/wire"
	"github.com/DiviProject/diviutil"
)

// RawChangeAddress : retrieves a legacy bitcoin address from the RPC
// Please note the address retrieved must be from the current network
// This can be configured by setting the `mainnet` `testnet` and `regtest` configuration
func RawChangeAddress(c *rpcd.Client, currency string) (diviutil.Address, error) {
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

	addr, err := diviutil.DecodeAddress(addrStr, network)
	if err != nil {
		return nil, err
	}

	if !addr.IsForNet(network) {
		return nil, fmt.Errorf("address %v is not intended for use on %v", addrStr, network.Name)
	}

	if _, ok := addr.(*diviutil.AddressPubKeyHash); !ok {
		return nil, fmt.Errorf("getrawchangeaddress: address %v is not P2PKH", addr)
	}

	return addr, nil
}

// CreateSig : Create a transaction signature
// This create a secure signature for a transaction bytes
// It encrypts it with the associated address' private key
func CreateSig(tx *wire.MsgTx, idx int, pkScript []byte, addr diviutil.Address, c *rpcd.Client) (sig, pubkey []byte, err error) {

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
