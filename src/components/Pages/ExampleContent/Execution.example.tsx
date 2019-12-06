import React, { Component } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

export class ExecutionExample extends Component {
    public constructor(props: any) {
        super(props);
        this.state = { menu: false };
    }

    public render() {
        return(
            <div className="example-wrap" id="e3">
                <h2>Executing Commands</h2>
                <div className="example">
                    <div className="example-content">
                        <div className="example-text">
                            <p>
                                When executing commands via the command line. Outputs received are required to do other functions with the atomic swap contract. Namely, the contract transactions, the bytes for the transactions as well as the secret seed for the atomic swap.
                            </p>
                            <p>
                                You need to copy and paste the output from the command line output to do this. If you are using HTTP, you can reference the API instead of the API Reference page.
                            </p>
                        </div>
                        <CodeMirror
                            value='$ atomicswap initiate [address] [amount]
$ # Output with secret seed, transaction hash etc.
$ atomicswap participate [address] [amount] [secret]
$ ...'
                            options={{
                                mode: 'shell',
                                theme: 'material',
                                lineNumbers: true
                            }}
                        />
                    </div>
                </div>

                <div className="example">
                    <div className="example-content">
                        <div className="example-text">
                            <p>
                                If you want to use the base or swap currency RPC specs, you need to specify them verbosely. Via <b>--use-base</b> or <b>--use-swap</b>. After specifying the base or swap specs, you need to make sure the addresses, contracts and hashes reflect that currency. A Divi address is not compatible with a Bitcoin node, and Vice Versa.
                            </p>
                        </div>
                        <CodeMirror
                            value='$ atomicswap --use-base initiate [address] [amount]
$ # Will execute an initiate for the base currency
$ atomicswap --use-swap initiate [address] [amount]
$ # Will execute an initiate for the swap currency'
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
