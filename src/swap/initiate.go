// Package swap provides various key functions to execute an atomic swap
package swap

import (
	"atomic-swaps/src/api"
	"atomic-swaps/src/util"
	"bytes"
	"crypto/rand"
	"fmt"
	"time"

	"github.com/DiviProject/diviutil"
)

// Initiate : Initiate an atomic swap
// Initiating an atomic swap requires a valid address and amount
// This address needs to be associated with the RPC Client
func Initiate(address string, amount float64, currency string, autopublish bool) (api.InitiateResponse, error) {
	network := RetrieveNetwork(currency)

	decodedAddress, err := diviutil.DecodeAddress(address, network)
	if err != nil {
		return api.InitiateResponse{"", "", "", "", "", "", "", "", "", "", struct{}{}, nil, 51200}, err
	}

	if !decodedAddress.IsForNet(network) {
		return api.InitiateResponse{"", "", "", "", "", "", "", "", "", "", struct{}{}, nil, 51200}, fmt.Errorf("This address is not for this currency")
	}

	p2pkh, ok := decodedAddress.(*diviutil.AddressPubKeyHash)
	if !ok {
		return api.InitiateResponse{"", "", "", "", "", "", "", "", "", "", struct{}{}, nil, 51200}, fmt.Errorf("participant address is not P2PKH")
	}

	cryptoAmount, err := diviutil.NewAmount(amount)
	if err != nil {
		return api.InitiateResponse{"", "", "", "", "", "", "", "", "", "", struct{}{}, nil, 51200}, err
	}

	client := GetRPCClient(currency)

	defer func() {
		client.Shutdown()
		client.WaitForShutdown()
	}()

	var secret [util.SecretSize]byte
	_, err = rand.Read(secret[:])
	if err != nil {
		return api.InitiateResponse{"", "", "", "", "", "", "", "", "", "", struct{}{}, nil, 51200}, err
	}

	secretHash := util.GenerateSHA256(secret[:])
	locktime := time.Now().Add(48 * time.Hour).Unix()

	b := BuildContract(
		client,
		&ContractArgs{
			them:       p2pkh,
			amount:     cryptoAmount,
			locktime:   locktime,
			secretHash: secretHash,
		},
		currency,
	)

	refundTxHash := b.refundTx.TxHash()
	contractFeePerKb := CalcFeePerKb(b.contractFee, b.contractTx.SerializeSize())
	refundFeePerKb := CalcFeePerKb(b.refundFee, b.refundTx.SerializeSize())

	fmt.Printf("Secret:      %x\n", secret)
	fmt.Printf("Secret hash: %x\n\n", secretHash)
	fmt.Printf("Contract fee: %v (%0.8f BTC/kB)\n", b.contractFee, contractFeePerKb)
	fmt.Printf("Refund fee:   %v (%0.8f BTC/kB)\n\n", b.refundFee, refundFeePerKb)
	fmt.Printf("Contract (%v):\n", b.contractP2SH)
	fmt.Printf("%x\n\n", b.contract)
	var contractBuf bytes.Buffer
	contractBuf.Grow(b.contractTx.SerializeSize())
	b.contractTx.Serialize(&contractBuf)
	fmt.Printf("Contract transaction (%v):\n", b.contractTxHash)
	fmt.Printf("%x\n\n", contractBuf.Bytes())
	var refundBuf bytes.Buffer
	refundBuf.Grow(b.refundTx.SerializeSize())
	b.refundTx.Serialize(&refundBuf)
	fmt.Printf("Refund transaction (%v):\n", &refundTxHash)
	fmt.Printf("%x\n\n", refundBuf.Bytes())

	PromptPublishTx(client, b.contractTx, "contract", autopublish)

	return api.InitiateResponse{
		fmt.Sprintf("%x", secret),
		fmt.Sprintf("%x", secretHash),
		b.contractFee.String(),
		b.refundFee.String(),
		b.contractP2SH.String(),
		fmt.Sprintf("%x", b.contract),
		b.contractTxHash.String(),
		fmt.Sprintf("%x", contractBuf.Bytes()),
		refundTxHash.String(),
		fmt.Sprintf("%x", refundBuf.Bytes()),
		struct{}{},
		nil,
		51200,
	}, nil
}
