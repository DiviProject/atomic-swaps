import React, { Component } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

export type InitiateProps = {

};

export type InitiateState = {
    example: number;
};

export const InitiateCLI = `$ atomicswap initiate [address] [amount]
$ Do you want to publish this transaction? [y/N]
$ yes`;

export const InitiateHTTP = `$ curl -d \\
    '{ \\
        "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", \\
        "amount": "1.0", \\
        "currency": "base" \\
    }' \\
$ -H "Content-Type: application/json" \\
$ -X POST http://localhost:3000/v1/initiate`;

export class InitiateExample extends Component<InitiateProps, InitiateState> {
    public constructor(props: any) {
        super(props);
        this.state = { example: 0 };
    }

    public render() {
        return(
            <div className="example-wrap" id="e4">
                <h2>Initiating an Atomic Swap</h2>
                <div className="example">
                    <div className="example-buttons">
                        <a className={`example-button ${this.state.example === 0 ? 'active' : ''}`} onClick={(() => this.setState({ example: 0 }))}>
                            CLI
                        </a>
                        <a className={`example-button ${this.state.example === 1 ? 'active' : ''}`} onClick={(() => this.setState({ example: 1 }))}>
                            HTTP
                        </a>
                    </div>

                    <div className="example-content">
                        <div className="example-text">
                            <p>
                                To start an atomic swap. You need to provide an address associated with the RPC node you are using (see the configuration section). Please note that you need to use an address compatible with either the base or swap RPC node.
                            </p>
                            <p>
                                You also need to provide an amount (in the RPC currency's value)
                                to keep in the atomic swap contract.
                            </p>
                        </div>
                        <CodeMirror
                            value={this.state.example === 0 ? InitiateCLI : InitiateHTTP}
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
