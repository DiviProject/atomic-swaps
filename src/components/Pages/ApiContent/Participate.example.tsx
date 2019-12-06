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

export const ParticipateProto = `syntax = "proto3";
package api;

import "google/api/annotations.proto";

message ParticipateRequest {
  string address = 1;
  double amount = 2;
  string hash = 3;
  string currency = 4;
}

message ParticipateResponse {
  string contractFee = 1;
  string refundFee = 2;
  string contract = 3;
  string contractBytes = 4;
  string contractTransaction = 5;
  string contractTransactionBytes = 6;
  string refundTransaction = 7;
  string refundTransactionBytes = 8;
}

service Participate {
  rpc participate(ParticipateRequest) returns (ParticipateResponse) {
   option (google.api.http) = {
    post: "/v1/participate"
    body: "*"
   };
  }
}`;

export class ParticipateApi extends Component<ParticipateProps, ParticipateState> {
    public constructor(props: any) {
        super(props);
        this.state = { example: 0 };
    }

    public returnExample() {
        if (this.state.example === 0) {
            return ParticipateCLI;
        } else if (this.state.example === 1) {
            return ParticipateHTTP;
        } else {
            return ParticipateProto;
        }
    }

    public render() {
        return(
            <div className="example-wrap" id="e2">
                <h2>
                    <span className="bold">[POST]</span>
                    /v1/participate
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
                            <h4>
                                <span className="red">[string]</span>
                                hash
                            </h4>
                            <p>
                                The secret hash that was created during an initiate atomic swap
                                HTTP call.
                            </p>

                            <h3>Request Response</h3>

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
                                contract
                            </h4>
                            <p>
                                The contract transaction hash.
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                contractTransaction
                            </h4>
                            <p>
                                The contract transaction hash in byte form. Use it to participate in an atomic swap.
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                contractRefund
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
