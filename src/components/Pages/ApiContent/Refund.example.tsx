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

export const RefundProto = `syntax = "proto3";
package api;

import "google/api/annotations.proto";

message RefundRequest {
  string contract = 1;
  string transaction = 2;
  string currency = 3;
}

message RefundResponse {
  string refundFee = 1;
  string refundTransaction = 2;
}

service Refund {
  rpc refund(RefundRequest) returns (RefundResponse) {
   option (google.api.http) = {
    post: "/v1/refund"
    body: "*"
   };
  }
}`;

export class RefundApi extends Component<RefundProps, RefundState> {
    public constructor(props: any) {
        super(props);
        this.state = { example: 0 };
    }

    public returnExample() {
        if (this.state.example === 0) {
            return RefundCLI;
        } else if (this.state.example === 1) {
            return RefundHTTP;
        } else {
            return RefundProto;
        }
    }

    public render() {
        return(
            <div className="example-wrap" id="e4">
                <h2>
                    <span className="bold">[POST]</span>
                    /v1/refund
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
                                contract
                            </h4>
                            <p>
                                The contract address that is holding the atomic swap funds.
                            </p>
                            <h4>
                                <span className="red">[string]</span>
                                transaction
                            </h4>
                            <p>
                                The contract transaction bytes to verify the atomic swap.
                            </p>

                            <h3>Request Response</h3>

                            <h4>
                                <span className="red">[string]</span>
                                refundFee
                            </h4>
                            <p>
                                How much it will cost to refund the atomic swap (in the base currency).
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                refundTransaction
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
