import React, { Component } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

export type ParticipateProps = {

};

export type ParticipateState = {
    example: number;
};

export const ParticipateCLI = `$ atomicswap participate [initiator's address] [amount] [secret]
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
                                To participate in an atomic swap. You need to get the initiator's address.
                                This address must be compatible with the swap RPC node.
                            </p>
                            <p>
                                You also need to provide an amount (in the RPC currency's value)
                                to send to the participate side of the atomic swap contract.
                            </p>
                            <p>
                                Once the initiate successfully execute. You will the contract and contract
                                transaction hashes and bytecodes for the participate contract. Make sure to save this and store it handy for later.
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
