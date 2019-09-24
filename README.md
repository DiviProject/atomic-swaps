# Atomic Swaps

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Go Version](https://img.shields.io/badge/Go-v1.1-blue.svg)
[![Go Report Card](https://goreportcard.com/badge/github.com/DiviProject/atomic-swaps)](https://goreportcard.com/report/github.com/DiviProject/atomic-swaps)
[![GoDoc](https://godoc.org/DiviProject/atomic-swaps?status.svg)](https://godoc.org/DiviProject/atomic-swaps)
![Docker Version](https://img.shields.io/badge/Docker-v2.0.0-blue.svg)
[![Build Status](https://travis-ci.org/DiviProject/atomic-swaps.svg?branch=master)](https://travis-ci.org/DiviProject/atomic-swaps)
[![codecov](https://codecov.io/gh/DiviProject/atomic-swaps/branch/master/graph/badge.svg)](https://codecov.io/gh/DiviProject/atomic-swaps)

#### On chain atomic swaps for Divi, Bitcoin and other cryptocurrencies with gRPC support.

Based off of the original [Atomic Swap implementation by Decred](https://github.com/decred/atomicswap). Divi has created a production ready Atomic Swap implementation that is gRPC and HTTP enabled. This enables Atomic Swaps to be workable with mobile and web applications.

## Compiling from source

### Compilation and Installation

#### Without Docker

```bash
export GO111MODULE=auto
go mod verify
go mod tidy

# Build for Unix
go build -i -o ./dist/atomicswap ./src/atomicswap.go

# Build for Windows
SET GOOS=windows
SET GOARCH=amd64
go build -i -o ./dist/atomicswap.exe ./src/atomicswap.go

# To simply just run the project
go run src/atomicswap.go
```

#### With Docker

```bash
docker build -t atomicswaps .
docker run atomicswaps
docker attach atomicswaps
```

### Command line usage

```bash
$ atomicswaps --help

A fast and easy way to do atomic swaps for Divi and Bitcoin. Learn more at https://github.com/DiviProject/atomic-swaps

Usage:
  atomicswap [flags]
  atomicswap [command]

Available Commands:
  audit       audit and validate an existing atomic swap contract. Usage: audit [contract] [contract transaction]
  extract     extract the secret for an atomic swap. Usage: extract [contract transaction] [secret]
  help        Help about any command
  initiate    initiate an atomic swap. Usage: initiate [address] [amount]
  participate participate in an atomic swap. Usage: participate [address] [amount] [secret]
  redeem      redeem an atomic swap. Usage: redeem [contract] [contract transaction] [secret]
  refund      refund an atomic swap. Usage: refund [contract] [contract transaction]
  version     print the version of atomicswap

Flags:
      --base-rpc-host string       the base currency host of the wallet RPC server (default "localhost")
      --base-rpc-password string   the base currency password of the wallet RPC server (default "password")
      --base-rpc-port int          the base currency port of the wallet RPC server (default 1337)
      --base-rpc-user string       the base currency user of the wallet RPC server (default "user")
  -c, --config string              the path to the Configuration file
      --database string            the default mongo database (default "atomic-swaps")
      --grpc-port int              the port of the gRPC server (raw tcp) (default 9999)
  -h, --help                       help for atomicswap
      --mongo-url string           the url for the MongoDB service (default "mongodb://localhost:27017")
  -y, --no-prompt                  do not prompt transactions with a y/n
      --server-port int            the port of the HTTP server (default 9001)
      --swap-rpc-host string       the swap currency host of the wallet RPC server (default "localhost")
      --swap-rpc-password string   the swap currency password of the wallet RPC server (default "password")
      --swap-rpc-port int          the swap currency port of the wallet RPC server (default 1337)
      --swap-rpc-user string       the swap currency user of the wallet RPC server (default "user")
      --use-base string            Use the base currency RPC specs for the CLI command, default is base (default "base")
      --use-swap string            Use the swap currency RPC specs for the CLI command, default is base (default "swap")
```

### Atomic Swap environment files

By default the binary will reference `./.atomicswap.json` as an environment file.

You can also define a configuration file with a flag

```bash
atomicswap --config .atomicswap.json
```

Below is a sample definition of an atomic swap configuration.

```json
{
    "base-currency": "divi",
    "base-rpc-host": "localhost",
    "base-rpc-port": 1337,
    "base-rpc-user": "divi",
    "base-rpc-password": "divi",
    "base-network": "regtest",
    "swap-currency": "bitcoin",
    "swap-rpc-host": "localhost",
    "swap-rpc-port": 1338,
    "swap-rpc-user": "bitcoin",
    "swap-rpc-password": "bitcoin",
    "swap-network": "regtest",
    "mongodb": "mongodb://localhost:27017",
    "database": "atomic-swaps",
    "server-port": 9001,
    "grpc-port": 9999
}
```

### HTTP usage

Run as a HTTP gRPC server

```bash
atomicswap --serverport 9001
```

You can now run JSON RPC HTTP requests to the server. Please refer to `API.md` to learn how to interact with the RPC HTTP API.

### Testing

Running `go test` will cover unit tests for the project.
Keep in mind that in order to run `regtest` nodes. It's best that you use a shared Docker volume.

```bash
# Unix
docker build -t atomicswaps -f docker/test.Dockerfile .
docker run -it -v $PWD:/app atomicswaps

# Windows
docker build -t atomicswaps -f docker/test.Dockerfile .
docker run -it -v %cd%:/app atomicswaps

# After connecting to the container
sh bin/regtest.divi.sh
sh bin/regtest.bitcoin.sh
```

With two functional regtest nodes working. In order to test both command line and http functionality. You'll need Node.js.

```bash
cd test
yarn # or npm install

# Test HTTP Queries
export SERVER_URL='http://localhost:9001'
yarn test-http

# Test CLI Queries
export BINARY_PATH='../dist/atomicswap'
yarn test-cli

# Setting CLI path on Windows
SET BINARY_PATH=..\dist\atomicswap.exe
```

Be mindful it may take a while to build and compile the container. Also make sure you have the minimum device specs to run the container.

### Issues and Pull Requests

Issues and pull requests are open on this repository. Please try to follow the guidelines specified in `.github`.
