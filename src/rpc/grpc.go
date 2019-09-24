// Package rpc provides the functions to execute raw TCP and HTTP requests
package rpc

import (
	"bytes"
	"context"
	"encoding/hex"
	"fmt"
	"log"
	"net"
	"time"

	"atomic-swaps/src/api"
	"atomic-swaps/src/db"
	"atomic-swaps/src/swap"
	"atomic-swaps/src/util"

	"github.com/btcsuite/btcd/wire"
	"google.golang.org/grpc"
)

// Server : Placeholder struct for Server responses
type Server struct{}

// Server : The server endpoint response
// The api endpoint is /v1/ping
// It returns a ping message and the current unix time
func (s *Server) Server(ctx context.Context, message *api.ServerRequest) (*api.ServerResponse, error) {
	ping := "pong"
	time := int64(time.Now().Unix())
	return &api.ServerResponse{ping, time, util.Configuration.BaseCurrency, util.Configuration.SwapCurrency, struct{}{}, nil, 128}, nil
}

// Initiate : Placeholder struct for Initiate responses
type Initiate struct{}

// Initiate : The initiate endpoint response
// The api endpoint is /v1/initiate
// It returns the data in regards to initiating an atomic swap contract
func (s *Initiate) Initiate(ctx context.Context, message *api.InitiateRequest) (*api.InitiateResponse, error) {
	address := message.GetAddress()
	amount := message.GetAmount()
	currency := message.GetCurrency()

	response, err := swap.Initiate(address, amount, currency, true)

	return &response, err
}

// Participate : Placeholder struct for participate responses
type Participate struct{}

// Participate : The participate endpoint response
// The api endpoint is /v1/participate
// It returns the data in regards to participating an atomic swap contract
func (s *Participate) Participate(ctx context.Context, message *api.ParticipateRequest) (*api.ParticipateResponse, error) {
	address := message.GetAddress()
	amount := message.GetAmount()
	currency := message.GetCurrency()

	hash, err := hex.DecodeString(message.GetHash())

	if err != nil {
		return &api.ParticipateResponse{"", "", "", "", "", struct{}{}, nil, 51200}, err
	}

	response, err := swap.Participate(address, amount, hash, currency, true)

	return &response, err
}

// Redeem : Placeholder struct for redeem responses
type Redeem struct{}

// Redeem : The redeem endpoint response
// The api endpoint is /v1/participate
// It returns the data in regards to redeeming an atomic swap contract
func (s *Redeem) Redeem(ctx context.Context, message *api.RedeemRequest) (*api.RedeemResponse, error) {
	contract, err := hex.DecodeString(message.GetContract())
	if err != nil {
		return &api.RedeemResponse{"", "", struct{}{}, nil, 51200}, err
	}

	transaction, err := hex.DecodeString(message.GetTransaction())
	if err != nil {
		return &api.RedeemResponse{"", "", struct{}{}, nil, 51200}, err
	}

	var contractTx wire.MsgTx
	err = contractTx.Deserialize(bytes.NewReader(transaction))
	if err != nil {
		return &api.RedeemResponse{"", "", struct{}{}, nil, 51200}, err
	}

	secret, err := hex.DecodeString(message.GetSecret())
	if err != nil {
		return &api.RedeemResponse{"", "", struct{}{}, nil, 51200}, err
	}

	currency := message.GetCurrency()

	response, err := swap.Redeem(contract, contractTx, secret, currency, true)

	return &response, err
}

// Refund : Placeholder struct for refund responses
type Refund struct{}

// Refund : The Refund endpoint response
// The api endpoint is /v1/refund
// It returns the data in regards to getting a refund from an atomic swap contract
func (s *Refund) Refund(ctx context.Context, message *api.RefundRequest) (*api.RefundResponse, error) {
	contract := message.GetContract()
	transaction := message.GetTransaction()
	currency := message.GetCurrency()

	c, _ := hex.DecodeString(contract)
	cTx, _ := hex.DecodeString(transaction)

	var contractTx wire.MsgTx
	err := contractTx.Deserialize(bytes.NewReader(cTx))
	if err != nil {
		return &api.RefundResponse{"", "", struct{}{}, nil, 51200}, fmt.Errorf("failed to decode contract transaction: %v", err)
	}

	response, err := swap.Refund(c, contractTx, currency, true)

	return &response, err
}

// Extract : The placeholder struct for extract responses
type Extract struct{}

// Extract : The extract endpoint response
// The api endpoint is /v1/extract
// It returns the data in regards to extracting the secret information from an atomic swap contract
func (s *Extract) Extract(ctx context.Context, message *api.ExtractRequest) (*api.ExtractResponse, error) {
	transaction := message.GetTransaction()
	secret := message.GetSecret()

	contractTxBytes, _ := hex.DecodeString(transaction)
	secretHash, _ := hex.DecodeString(secret)

	var contractTx wire.MsgTx
	err := contractTx.Deserialize(bytes.NewReader(contractTxBytes))
	if err != nil {
		panic(fmt.Errorf("failed to decode contract transaction: %v", err))
	}

	currency := message.GetCurrency()

	response, err := swap.Extract(contractTx, secretHash, currency, true)

	return &response, err
}

// Audit : The placeholder struct for audit responses
type Audit struct{}

// Audit : The audit endpoint response
// The api endpoint is /v1/audit
// It returns the data in regards to verifying an atomic swap contract is valid
func (s *Audit) Audit(ctx context.Context, message *api.AuditRequest) (*api.AuditResponse, error) {
	contract := message.GetContract()
	transaction := message.GetTransaction()

	contractHash, _ := hex.DecodeString(contract)
	contractTxBytes, _ := hex.DecodeString(transaction)

	var contractTx wire.MsgTx
	err := contractTx.Deserialize(bytes.NewReader(contractTxBytes))
	if err != nil {
		return &api.AuditResponse{"", "", "", "", "", "", struct{}{}, nil, 51200}, fmt.Errorf("failed to decode contract transaction: %v", err)
	}

	currency := message.GetCurrency()

	response, err := swap.Audit(contractHash, contractTx, currency, true)

	return &response, err
}

// Swap : The placeholder struct for swap responses
type Swap struct{}

// Swap : The swap endpoint response
// The api endpoint is /v1/swap
// It returns a successful initialization for an atomic swap.
func (s *Swap) Swap(ctx context.Context, message *api.SwapRequest) (*api.SwapResponse, error) {
	baseAmount := message.GetBaseAmount()
	baseAddress := message.GetBaseAddress()
	swapAmount := message.GetSwapAmount()
	swapAddress := message.GetSwapAddress()

	documentID, err := db.ScheduleSwap(baseAmount, baseAddress, swapAmount, swapAddress)
	success := "pending"

	if err != nil {
		success = "error"
	}

	return &api.SwapResponse{success, documentID, struct{}{}, nil, 51200}, err
}

// Swapstatus : The placeholder struct for audit responses
type Swapstatus struct{}

// Swapstatus : The swap status endpoint response
// The api endpoint is /v1/swap/{id}
// It returns the status of a pending atomic swap
func (s *Swapstatus) Swapstatus(ctx context.Context, message *api.SwapStatusRequest) (*api.SwapStatusResponse, error) {
	swapID := message.GetId()
	SwapDocument, err := db.Find(swapID)

	return &api.SwapStatusResponse{SwapDocument.Status, SwapDocument.BaseStatus, SwapDocument.SwapStatus, SwapDocument.BaseAddress, SwapDocument.SwapAddress, SwapDocument.BaseContract, SwapDocument.SwapContract, SwapDocument.BaseTransaction, SwapDocument.SwapTransaction, struct{}{}, nil, 51200}, err
}

// StartGRPCServer : Starts a fresh GRPC Server on TCP
func StartGRPCServer(port string) {
	tcp, err := net.Listen("tcp", ":"+port)
	if err != nil {
		log.Fatalf("Error starting GRPC Server: %v", err)
	}

	server := grpc.NewServer()

	api.RegisterServerServer(server, &Server{})
	api.RegisterInitiateServer(server, &Initiate{})
	api.RegisterParticipateServer(server, &Participate{})
	api.RegisterRedeemServer(server, &Redeem{})
	api.RegisterRefundServer(server, &Refund{})
	api.RegisterExtractServer(server, &Extract{})
	api.RegisterAuditServer(server, &Audit{})
	api.RegisterSwapServer(server, &Swap{})
	api.RegisterSwapStatusServer(server, &Swapstatus{})

	fmt.Println("Starting gRPC server on " + port)
	server.Serve(tcp)
}
