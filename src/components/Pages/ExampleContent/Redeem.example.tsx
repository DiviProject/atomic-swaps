import React, { Component } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

export type RedeemProps = {

};

export type RedeemState = {
    example: number;
};

export const RedeemCLI = `$ atomicswap redeem [contract] [contract transaction] [secret]
$ Do you want to publish this transaction? [y/N]
$ yes`;

export const RedeemHTTP = `$ curl -d \\
'{ \\
    "contract": "contract hash", \\
    "transaction": "contract transaction bytes", \\
    "secret": "1A1zP1ePsatoshi5QGefi2DMPTfTL5SLmpoopamotov7DivfNa", \\
    "currency": "base" \\
}' \\
$ -H "Content-Type: application/json" \\
$ -X POST http://localhost:3000/v1/redeem`;

export class RedeemExample extends Component<RedeemProps, RedeemState> {
    public constructor(props: any) {
        super(props);
        this.state = { example: 0 };
    }

    public render() {
        return(
            <div className="example-wrap" id="e6">
                <h2>Redeeming an atomic swap</h2>
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
                                If someone has participated in your atomic swap. You can then redeem your funds from their wallet by using the redeem command. You can use the secret provided by either the participate transaction or the initial transaction and then redeem funds to your wallet.
                            </p>
                            <p>
                                Remember, there must be a connection to the RPC node that has the address and private key associated with the initiated or participating atomic swap contract.
                            </p>
                        </div>
                        <CodeMirror
                            value={this.state.example === 0 ? RedeemCLI : RedeemHTTP}
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
