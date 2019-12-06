import React, { Component } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

export type SwapProps = {

};

export type SwapState = {
    example: number;
};

export const SwapCLI = `$ atomicswap swapStatus`;

export const SwapHTTP = `$ curl -d -X GET http://localhost:3000/v1/swap/:swapId`;

export const SwapProto = `syntax = "proto3";
package api;

import "google/api/annotations.proto";

message SwapStatusRequest {
    string id = 1;
}

message SwapStatusResponse {
    string status = 1;
    string baseStatus = 2;
    string swapStatus = 3;
    string baseAddress = 4;
    string swapAddress = 5;
    string baseContract = 6;
    string swapContract = 7;
    string baseTransaction = 8;
    string swapTransaction = 9;
    string baseRedeemTransaction = 10;
    string swapRedeemTransaction = 11;
}

service SwapStatus {
  rpc swapstatus(SwapStatusRequest) returns (SwapStatusResponse) {
    option (google.api.http) = {
      get: "/v1/swap/{id}"
    };
  }
}`;

export class SwapStatusApi extends Component<SwapProps, SwapState> {
    public constructor(props: any) {
        super(props);
        this.state = { example: 1 };
    }

    public returnExample() {
        if (this.state.example === 0) {
            return SwapCLI;
        } else if (this.state.example === 1) {
            return SwapHTTP;
        } else {
            return SwapProto;
        }
    }

    public render() {
        return(
            <div className="example-wrap" id="e11">
                <h2>
                    <span className="bold">[GET]</span>
                    /v1/swap/:id
                </h2>
                <div className="example">
                    <div className="example-content">
                        <div className="example-text">
                            <h3>Request Parameters</h3>

                            <h4>
                                <span className="red">[string]</span>
                                :id
                            </h4>
                            <p>
                                The id of the pending atomic swap.
                            </p>

                            <h3>Request Response</h3>

                            <h4>
                                <span className="red">[string]</span>
                                status
                            </h4>
                            <p>
                                The status of the atomic swap. Either pending, error or complete.
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                baseStatus
                            </h4>
                            <p>
                                The base transaction status of the atomic swap. Either pending, error or complete.
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                swapStatus
                            </h4>
                            <p>
                                The swap transaction status of the atomic swap. Either pending, error or complete.
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                baseAddress
                            </h4>
                            <p>
                                The base address of the atomic swap.
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                swapAddress
                            </h4>
                            <p>
                                The swap address of the atomic swap.
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                baseContract
                            </h4>
                            <p>
                                The base contract address of the atomic swap.
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                swapContract
                            </h4>
                            <p>
                                The swap contract address of the atomic swap.
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                baseTransaction
                            </h4>
                            <p>
                                The base initiating transaction of the atomic swap.
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                swapTransaction
                            </h4>
                            <p>
                                The swap participating transaction of the atomic swap.
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                baseRedeemTransaction
                            </h4>
                            <p>
                                The base redeeming transaction of the atomic swap.
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                swapRedeemTransaction
                            </h4>
                            <p>
                                The swap redeeming transaction of the atomic swap.
                            </p>
                        </div>
                    </div>

                    <div className="example-buttons">
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
