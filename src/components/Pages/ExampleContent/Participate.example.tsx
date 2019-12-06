import React, { Component } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

export type ParticipateProps = {

};

export type ParticipateState = {
    example: number;
};

export const ParticipateCLI = `$ atomicswap participate [address] [amount] [secret]
$ Do you want to publish this transaction? [y/N]
$ yes`;

export const ParticipateHTTP = `$ curl -d \\
    '{ \\
        "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", \\
        "amount": "1.0", \\
        "secret": "1A1zP1ePsatoshi5QGefi2DMPTfTL5SLmpoopamotov7DivfNa", \\
        "currency": "base" \\
    }' \\
$ -H "Content-Type: application/json" \\
$ -X POST http://localhost:3000/v1/participate`;

export class ParticipateExample extends Component<ParticipateProps, ParticipateState> {
    public constructor(props: any) {
        super(props);
        this.state = { example: 0 };
    }

    public render() {
        return(
            <div className="example-wrap" id="e5">
                <h2>Participating in an atomic swap</h2>
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
                                To participate in an atomic swap. The person who created the original atomic swap contract must send you the secret. After you must use the participate command to create your atomic swap contract tied to the other contract.
                            </p>
                            <p>
                                You receive a contract, contract transaction and secret for your new atomic swap contract. You must provide these details to your friends so they can redeem their funds.
                            </p>
                        </div>
                        <CodeMirror
                            value={this.state.example === 0 ? ParticipateCLI : ParticipateHTTP}
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
