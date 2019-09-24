# Atomic Swaps

![Go Version](https://img.shields.io/badge/Go-v1.9-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
[![Go Report Card](https://goreportcard.com/badge/github.com/DiviProject/atomic-swaps)](https://goreportcard.com/report/github.com/DiviProject/atomic-swaps)
[![GoDoc](https://godoc.org/DiviProject/atomic-swaps?status.svg)](https://godoc.org/DiviProject/atomic-swaps)
[![Build Status](https://travis-ci.org/DiviProject/atomic-swaps.svg?branch=master)](https://travis-ci.org/DiviProject/atomic-swaps)
[![codecov](https://codecov.io/gh/DiviProject/atomic-swaps/branch/master/graph/badge.svg)](https://codecov.io/gh/DiviProject/atomic-swaps)

#### On chain atomic swaps for Divi, Bitcoin and other cryptocurrencies with gRPC support.

Based off of the original [Atomic Swap implementation by Decred](https://github.com/decred/atomicswap). Divi has created a production ready Atomic Swap implementation that is gRPC and HTTP enabled. This enables Atomic Swaps to be workable with mobile and web applications.

## Compiling from source

### Requirements

1. **Go** `>=1.9`

2. **gRPC** `go get -u google.golang.org/grpc`

3. **Protobuffers** `go get -u github.com/golang/protobuf/protoc-gen-go`

4. **Go BTC Suite**

```bash
go get -u github.com/btcsuite/btcd/txscript
go get -u github.com/btcsuite/btcd/wire
go get -u github.com/btcsuite/btcd/chaincfg
go get -u github.com/btcsuite/btcd/chaincfg/chainhash
go get -u github.com/btcsuite/btcd/rpcclient
go get -u github.com/btcsuite/btcutil
go get -u github.com/btcsuite/btcwallet/wallet/txrules
```

### Compilation

#### Without Docker

```bash
go build -i -o ./dist/atomicswaps ./src/*.go
```

#### With Docker

```bash
docker build -t atomicswaps .
docker run atomicswaps
docker attach atomicswaps
```

#### Issues and Pull Requests

Issues and pull requests are open on this repository. Please try to follow the guidelines specified in `.github`.
