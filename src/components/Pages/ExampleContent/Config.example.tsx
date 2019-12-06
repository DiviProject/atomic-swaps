import React, { Component } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

type ConfigProps = {

};

type ConfigState = {
    example: number;
};

export const ConfigExampleCLI = `$ atomicswap --help
$ A fast and easy way to do atomic swaps for Divi and Bitcoin. Learn more at https://github.com/DiviProject/atomic-swaps

$ Usage:
$   atomicswap [flags]
$   atomicswap [command]

$ Available Commands:
$   audit       audit and validate an existing atomic swap contract. Usage: audit [contract] [contract transaction]
$   extract     extract the secret for an atomic swap. Usage: extract [contract transaction] [secret]
$   help        Help about any command
$   initiate    initiate an atomic swap. Usage: initiate [address] [amount]
$   participate participate in an atomic swap. Usage: participate [address] [amount] [secret]
$   redeem      redeem an atomic swap. Usage: redeem [contract] [contract transaction] [secret]
$   refund      refund an atomic swap. Usage: refund [contract] [contract transaction]
$   version     print the version of atomicswap

$ Flags:
$       --base-confirmations int     the base currency confirmations required to redeem a swap (default 1)
$       --base-rpc-currency string   the base currency (default "bitcoin")
$       --base-rpc-host string       the base currency host of the wallet RPC server (default "localhost")
$       --base-rpc-network string    the base network configuration (default "regtest")
$       --base-rpc-password string   the base currency password of the wallet RPC server (default "password")
$       --base-rpc-port int          the base currency port of the wallet RPC server (default 1337)
$       --base-rpc-user string       the base currency user of the wallet RPC server (default "user")
$   -c, --config string              the path to the Configuration file
$       --database string            the default mongo database (default "atomic-swaps")
$       --grpc-port int              the port of the gRPC server (raw tcp) (default 9999)
$   -h, --help                       help for atomicswap
$       --mongo-url string           the url for the MongoDB service (default "mongodb://localhost:27017")
$   -y, --no-prompt                  do not prompt transactions with a y/n
$       --server-port int            the port of the HTTP server (default 9001)
$       --swap-confirmations int     the swap currency confirmations required to redeem a swap (default 1)
$       --swap-rpc-currency string   the swap currency (default "divi")
$       --swap-rpc-host string       the swap currency host of the wallet RPC server (default "localhost")
$       --swap-rpc-network string    the swap network configuration (default "regtest")
$       --swap-rpc-password string   the swap currency password of the wallet RPC server (default "password")
$       --swap-rpc-port int          the swap currency port of the wallet RPC server (default 1337)
$       --swap-rpc-user string       the swap currency user of the wallet RPC server (default "user")
$       --use-base string            Use the base currency RPC specs for the CLI command, default is base (default "base")
$       --use-swap string            Use the swap currency RPC specs for the CLI command, default is base (default "swap")`;

export const ConfigExampleJSON = `{
    // Base Currency RPC Configuration
    "base-currency": "divi",
    "base-rpc-host": "localhost",
    "base-rpc-port": 1337,
    "base-rpc-user": "divi",
    "base-rpc-password": "divi",
    "base-network": "regtest",
    // Swap Currency RPC Configuration
    "swap-currency": "bitcoin",
    "swap-rpc-host": "localhost",
    "swap-rpc-port": 1338,
    "swap-rpc-user": "bitcoin",
    "swap-rpc-password": "bitcoin",
    "swap-network": "regtest",
    // Server Configuration
    "server-port": 9001,
    "grpc-port": 9999
}`;

export class ConfigExample extends Component<ConfigProps, ConfigState> {
    public constructor(props: any) {
        super(props);
        this.state = { example: 0 };
    }

    public render() {
        return(
            <div className="example-wrap" id="e1">
                <h2>Configuring for Atomic Swaps</h2>
                <div className="example">
                    <div className="example-buttons">
                        <a className={`example-button ${this.state.example === 0 ? 'active' : ''}`} onClick={(() => this.setState({ example: 0 }))}>
                            CLI
                        </a>
                        <a className={`example-button ${this.state.example === 1 ? 'active' : ''}`} onClick={(() => this.setState({ example: 1 }))}>
                            .atomicswap.json
                        </a>
                    </div>

                    <div className="example-content">
                        <div className="example-text">
                            <p>
                                To configure an atomic swap server (or command-line tool). You need to either pass arguments into the command line or use an atomic swap JSON configuration file.
                            </p>
                            <p>
                                Below showcases how you can configure atomic swaps with both a configuration file and via command-line flags.
                            </p>
                        </div>
                        <CodeMirror
                            className="larger"
                            value={this.state.example === 0 ? ConfigExampleCLI : ConfigExampleJSON}
                            options={{
                                mode: 'shell',
                                theme: 'material',
                                lineNumbers: true
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
