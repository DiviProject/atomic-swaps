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

export const InitiateProto = `syntax = "proto3";
package api;

import "google/api/annotations.proto";

message InitiateRequest {
  string address = 1;
  double amount = 2;
  string currency = 3;
}

message InitiateResponse {
  string secret = 1;
  string secretHash = 2;
  string contractFee = 3;
  string refundFee = 4;
  string contractAddress = 5;
  string contractBytes = 6;
  string contractTransaction = 7;
  string contractTransactionBytes = 8;
  string contractRefund = 9;
  string contractRefundBytes = 10;
}

service Initiate {
  rpc initiate(InitiateRequest) returns (InitiateResponse) {
   option (google.api.http) = {
    post: "/v1/initiate"
    body: "*"
   };
  }
}`;

export class InitiateApi extends Component<InitiateProps, InitiateState> {
    public constructor(props: any) {
        super(props);
        this.state = { example: 0 };
    }

    public returnExample() {
        if (this.state.example === 0) {
            return InitiateCLI;
        } else if (this.state.example === 1) {
            return InitiateHTTP;
        } else {
            return InitiateProto;
        }
    }

    public render() {
        return(
            <div className="example-wrap" id="e1">
                <h2>
                    <span className="bold">[POST]</span>
                    /v1/initiate
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
                                address
                            </h4>
                            <p>
                                The address that will be receiving and transferring
                                Divi or Bitcoin. This address must be associated with
                                the RPC node as per Configuration.
                            </p>
                            <h4>
                                <span className="red">[double]</span>
                                amount
                            </h4>
                            <p>
                                The amount you want to transact for the atomic swap contract.
                                1 will denominate 1 Divi or Bitcoin. 1.555 will denominate 1.555
                                Divi or Bitcoin.
                            </p>

                            <h3>Request Response</h3>

                            <h4>
                                <span className="red">[string]</span>
                                secret
                            </h4>
                            <p>
                                The secret to give a participant to redeem atomic swap
                                funds.
                            </p>
                            <h4>
                                <span className="red">[string]</span>
                                secretHash
                            </h4>
                            <p>
                                The secret hash (in hex bytes) to give a participant to redeem atomic swap
                                funds.
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                contractFee
                            </h4>
                            <p>
                                How much it will cost to execute the atomic swap (in the base currency).
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                refundFee
                            </h4>
                            <p>
                                How much it will cost to refund the atomic swap (in the base currency).
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                contractAddress
                            </h4>
                            <p>
                                The address where the atomic swap funds will be stored.
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                contractBytes
                            </h4>
                            <p>
                                The contract transaction bytes. Use it to participate in an atomic swap.
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                contractTransaction
                            </h4>
                            <p>
                                The contract transaction hash. Use it to participate in an atomic swap.
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                contractRefund
                            </h4>
                            <p>
                                The contract refund transaction hash. Use it to refund an atomic swap.
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                contractRefundBytes
                            </h4>
                            <p>
                                The contract refund transaction bytes. Use it to refund an atomic swap.
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
