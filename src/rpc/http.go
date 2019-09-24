// Package rpc provides the functions to execute raw TCP and HTTP requests
package rpc

import (
	"context"
	"flag"
	"fmt"
	"net/http"

	"atomic-swaps/src/api"

	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	"google.golang.org/grpc"
)

// StartHTTPServer : Start the Http Api Server
// This maps routes from the GRPC server to a regular REST HTTP server
// You can reference the API documentation here: https://atomic-swaps.diviproject.org to learn how to interact with the server.
func StartHTTPServer(grpcPort string, httpPort string) error {
	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	mux := runtime.NewServeMux()
	opts := []grpc.DialOption{grpc.WithInsecure()}

	err := api.RegisterServerHandlerFromEndpoint(ctx, mux, *flag.String("server", "localhost:"+grpcPort, "/v1/ping"), opts)
	if err != nil {
		return err
	}
	err = api.RegisterInitiateHandlerFromEndpoint(ctx, mux, *flag.String("initiate", "localhost:"+grpcPort, "/v1/initiate"), opts)
	if err != nil {
		return err
	}
	err = api.RegisterParticipateHandlerFromEndpoint(ctx, mux, *flag.String("participate", "localhost:"+grpcPort, "/v1/participate"), opts)
	if err != nil {
		return err
	}
	err = api.RegisterRedeemHandlerFromEndpoint(ctx, mux, *flag.String("redeem", "localhost:"+grpcPort, "/v1/redeem"), opts)
	if err != nil {
		return err
	}
	err = api.RegisterRefundHandlerFromEndpoint(ctx, mux, *flag.String("refund", "localhost:"+grpcPort, "/v1/refund"), opts)
	if err != nil {
		return err
	}
	err = api.RegisterExtractHandlerFromEndpoint(ctx, mux, *flag.String("extract", "localhost:"+grpcPort, "/v1/extract"), opts)
	if err != nil {
		return err
	}
	err = api.RegisterAuditHandlerFromEndpoint(ctx, mux, *flag.String("audit", "localhost:"+grpcPort, "/v1/audit"), opts)
	if err != nil {
		return err
	}
	err = api.RegisterSwapHandlerFromEndpoint(ctx, mux, *flag.String("swap", "localhost:"+grpcPort, "/v1/swap"), opts)
	if err != nil {
		return err
	}
	err = api.RegisterSwapStatusHandlerFromEndpoint(ctx, mux, *flag.String("swapstatus", "localhost:"+grpcPort, "/v1/swap/{id}"), opts)
	if err != nil {
		return err
	}

	fmt.Println("Starting HTTP server on", httpPort)
	return http.ListenAndServe(":"+httpPort, mux)
}
