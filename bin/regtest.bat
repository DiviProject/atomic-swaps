./bitcoin/src/bitcoind.exe -server -rest -regtest -rpcuser=bitcoin -rpcpassword=bitcoin -rpcport=1338

export BITCOIN_ADDRESS=$(./bitcoin/src/bitcoin-cli.exe -regtest -rpcuser=bitcoin -rpcpassword=bitcoin -rpcport=1338 getnewaddress "" "legacy")
./bitcoin/src/bitcoin-cli.exe -regtest -rpcuser=bitcoin -rpcpassword=bitcoin -rpcport=1338 generatetoaddress 125 $BITCOIN_ADDRESS

./divi/src/divid.exe -server -rest -regtest -rpcuser=divi -rpcpassword=divi -rpcport=1337

export DIVI_ADDRESS=$(./divi/src/divi-cli.exe -regtest -rpcuser=divi -rpcpassword=divi -rpcport=1337 getnewaddress "" "legacy")
./divi/src/divi-cli.exe -regtest -rpcuser=divi -rpcpassword=divi -rpcport=1337 generatetoaddress 125 $DIVI_ADDRESS
