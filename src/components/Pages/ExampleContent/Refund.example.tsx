import React, { Component } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

export type RefundProps = {

};

export type RefundState = {
    example: number;
};

export const RefundCLI = `$ atomicswap refund [contract] [contract transaction]
$ Do you want to publish this transaction? [y/N]
$ yes`;

export const RefundHTTP = `$ curl -d \\
'{ \\
    "contract": "contract hash", \\
    "transaction": "contract transaction bytes", \\
    "currency": "base" \\
}' \\
$ -H "Content-Type: application/json" \\
$ -X POST http://localhost:3000/v1/redeem`;

export class RefundExample extends Component<RefundProps, RefundState> {
    public constructor(props: any) {
        super(props);
        this.state = { example: 0 };
    }

    public render() {
        return(
            <div className="example-wrap" id="e7">
                <h2>Refunding an atomic swap</h2>
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
                                If at any point you want to back out of an atomic swap. You can refund the contract you created. Whether it was a `participate` or `initiate` contract. Input the contract hash and the contract transaction bytes. And the funds are transferred back to the original address.
                            </p>
                            <p>
                                A connection to the RPC node that has the address and private key associated with the atomic swap contract is required to execute a refund successfully.
                            </p>
                        </div>
                        <CodeMirror
                            value={this.state.example === 0 ? RefundCLI : RefundHTTP}
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
