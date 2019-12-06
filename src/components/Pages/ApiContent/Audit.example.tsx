import React, { Component } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

export type AuditProps = {

};

export type AuditState = {
    example: number;
};

export const AuditCLI = `$ atomicswap audit [contract] [contract transaction]
$ Contract details`;

export const AuditHTTP = `$ curl -d \\
'{ \\
    "contract": "contract hash", \\
    "transaction": "contract transaction bytes", \\
    "currency": "base" \\
}' \\
$ -H "Content-Type: application/json" \\
$ -X POST http://localhost:3000/v1/audit`;

export const AuditProto = `syntax = "proto3";
package api;

import "google/api/annotations.proto";

message AuditRequest {
  string contract = 1;
  string transaction = 2;
  string currency = 3;
}

message AuditResponse {
  string contractAddress = 1;
  string contractValue = 2;
  string recipientAddress = 3;
  string refundAddress = 4;
  string secretHash = 5;
  string lockTimeBlock = 6;
}

service Audit {
  rpc audit(AuditRequest) returns (AuditResponse) {
   option (google.api.http) = {
    post: "/v1/audit"
    body: "*"
   };
  }
}`;

export class AuditApi extends Component<AuditProps, AuditState> {
    public constructor(props: any) {
        super(props);
        this.state = { example: 0 };
    }

    public returnExample() {
        if (this.state.example === 0) {
            return AuditCLI;
        } else if (this.state.example === 1) {
            return AuditHTTP;
        } else {
            return AuditProto;
        }
    }

    public render() {
        return(
            <div className="example-wrap" id="e5">
                <h2>
                    <span className="bold">[POST]</span>
                    /v1/audit
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
                                contractAddress
                            </h4>
                            <p>
                                The contract address that holds the atomic swap funds.
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                contractValue
                            </h4>
                            <p>
                                The amount of Divis or Bitcoin in the atomic swap contract.
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                recipientAddress
                            </h4>
                            <p>
                                The address that will receive the atomic swap funds.
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                refundAddress
                            </h4>
                            <p>
                                The address who will receive the atomic swap funds if a refund is triggered.
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                secretHash
                            </h4>
                            <p>
                                The secret hash used to verify the atomic swap.
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                lockTimeBlock
                            </h4>
                            <p>
                                The estimated block where the atomic swap contract will expire.
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
