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

export const RedeemProto = `syntax = "proto3";
package api;

import "google/api/annotations.proto";

message RedeemRequest {
  string contractBytes = 1;
  string transactionBytes = 2;
  string secret = 3;
  string currency = 4;
}

message RedeemResponse {
  string redeemFee = 1;
  string redeemTransaction = 2;
}

service Redeem {
  rpc redeem(RedeemRequest) returns (RedeemResponse) {
   option (google.api.http) = {
    post: "/v1/redeem"
    body: "*"
   };
  }
}`;

export class RedeemApi extends Component<RedeemProps, RedeemState> {
    public constructor(props: any) {
        super(props);
        this.state = { example: 0 };
    }

    public returnExample() {
        if (this.state.example === 0) {
            return RedeemCLI;
        } else if (this.state.example === 1) {
            return RedeemHTTP;
        } else {
            return RedeemProto;
        }
    }

    public render() {
        return(
            <div className="example-wrap" id="e3">
                <h2>
                    <span className="bold">[POST]</span>
                    /v1/redeem
                </h2>
                <div className="example">
                    <div className="example-content">
                        <div className="example-text">
                            <h3>Request Body</h3>

                            <h4>
                                <span className="red">[string]</span>
                                currency
                            </h4>
                            <p>
                                Specify "base" for the base currency.
                                Specify "swap" for the swap currency.
                                Base and swap currencies are determined by
                                the configuration of the gRPC node.
                            </p>
                            <h4>
                                <span className="red">[string]</span>
                                contractBytes
                            </h4>
                            <p>
                                The contract bytecode that was received when creating an atomic swap initiate or participate contract.
                            </p>
                            <h4>
                                <span className="red">[string]</span>
                                transactionBytes
                            </h4>
                            <p>
                                The contract transaction bytecode that was received when creating an atomic swap initiate or participate contract.
                            </p>
                            <h4>
                                <span className="red">[secret]</span>
                                hash
                            </h4>
                            <p>
                                The secret that was created during an initiate atomic swap call.
                            </p>

                            <h3>Request Response</h3>

                            <h4>
                                <span className="red">[string]</span>
                                redeemFee
                            </h4>
                            <p>
                                How much it will cost to refund the atomic swap (in the base currency).
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                redeemTransaction
                            </h4>
                            <p>
                                The contract transaction hash in byte form. Use it to participate in an atomic swap.
                            </p>
                        </div>
                    </div>

                    <div className="example-buttons">
                        <a className={`example-button ${this.state.example === 0 ? 'active' : ''}`} onClick={(() => this.setState({ example: 0 }))}>
                            CLI
                        </a>
                        <a className={`example-button ${this.state.example === 1 ? 'active' : ''}`} onClick={(() => this.setState({ example: 1 }))}>
                            HTTP
                        </a>
                        <a className={`example-button ${this.state.example === 2 ? 'active' : ''}`} onClick={(() => this.setState({ example: 2 }))}>
                            Protofile
                        </a>
                    </div>

                    <div className="example-content">
                        <CodeMirror
                            value={this.returnExample()}
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
