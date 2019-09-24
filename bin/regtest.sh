#!/bin/bash

# Start Bitcoin regtest
./bitcoin/src/bitcoind -server -rest -regtest -daemon -rpcuser=bitcoin -rpcpassword=bitcoin -rpcport=1338
sleep 2.5
export BITCOIN_ADDRESS=$(./bitcoin/src/bitcoin-cli -regtest -rpcuser=bitcoin -rpcpassword=bitcoin -rpcport=1338 getnewaddress "" "legacy")
./bitcoin/src/bitcoin-cli -regtest -rpcuser=bitcoin -rpcpassword=bitcoin -rpcport=1338 generatetoaddress 125 $BITCOIN_ADDRESS

# Start Divi regtest
./divi/src/divid -server -rest -regtest -daemon -rpcuser=divi -rpcpassword=divi -rpcport=1337
sleep 2.5
export DIVI_ADDRESS=$(./divi/src/divi-cli -regtest -rpcuser=divi -rpcpassword=divi -rpcport=1337 getnewaddress "" "legacy")
./divi/src/divi-cli -regtest -rpcuser=divi -rpcpassword=divi -rpcport=1337 generatetoaddress 125 $DIVI_ADDRESS