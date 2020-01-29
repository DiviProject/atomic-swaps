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
                                If you do not want to run an Atomic Swap node. You can execute atomic swaps from the command line.
                                Referencing the documentation provided in the config section. All the required logistics to execute
                                are there.
                            </p>
                            <p>
                                Be mindful when executing via command line. You will need to copy and paste output to execute other
                                portions of the atomic swap. Such as the participate and the redeem functions.
                            </p>
                        </div>
                        <CodeMirror
                            value={`$ atomicswap initiate [participant's address] [amount]
$ # Output with secret seed, transaction hash etc.
$ atomicswap participate [address] [amount] [secret]
$ ...`}
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
                                If you want to use the base or swap currency RPC specs when executing commands from terminal, you need to specify them with <b>--use-base</b> or <b>--use-swap</b>.
                                After specifying the base or swap specs, you need to make sure the addresses, contracts and hashes reflect that currency.
                                A Divi address is not compatible with a Bitcoin node, and vice/versa.
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
