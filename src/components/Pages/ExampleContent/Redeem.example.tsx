import React, { Component } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

export type RedeemProps = {

};

export type RedeemState = {
    example: number;
};

export const RedeemCLI = `$ atomicswap redeem [contract bytes] [contract transaction bytes] [secret]
$ Do you want to publish this transaction? [y/N]
$ yes`;

export const RedeemHTTP = `$ curl -d \\
'{ \\
    "contract": "contract bytes", \\
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
                                In order to redeem the transaction.
                                You must execute the redeem for both the initiate and participate contracts.
                            </p>
                            <p>
                                For the base currency. You will need to use the initiate contract bytecodes to redeem it.
                            </p>
                            <p>
                                For the swap currency. You will need to use the participate contract bytecodes to redeem it.
                            </p>
                            <p>
                                Once both transactions are submitted on both networks. The atomic swap was successfully
                                executed. Good work!
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
