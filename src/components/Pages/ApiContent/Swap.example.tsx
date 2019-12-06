import React, { Component } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

export type SwapProps = {

};

export type SwapState = {
    example: number;
};

export const SwapCLI = `$ atomicswap swap`;

export const SwapHTTP = `$ curl -d \\
'{ \\
    "baseAmount": "1.0000", \\
    "baseAddress": "1A1zsatoshiefi2DMPpoopamotomv7DivfNa", \\
    "swapAmount": "1.0000", \\
    "swapAddress": "1A1zsatoshiefi2DMPpoopamotomv7DivfNa", \\
}' \\
$ -H "Content-Type: application/json" \\
$ -X POST http://localhost:3000/v1/swap`;

export const SwapProto = `syntax = "proto3";
package api;

import "google/api/annotations.proto";

message SwapRequest {
    string baseAmount = 1;
    string baseAddress = 2;
    string swapAmount = 3;
    string swapAddress = 4;
}

message SwapResponse {
    string status = 1;
    string swapId = 2;
}

service Swap {
  rpc swap(SwapRequest) returns (SwapResponse) {
    option (google.api.http) = {
      post: "/v1/swap"
      body: "*"
    };
}`;

export class SwapApi extends Component<SwapProps, SwapState> {
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
            <div className="example-wrap" id="e10">
                <h2>
                    <span className="bold">[POST]</span>
                    /v1/swap
                </h2>
                <div className="example">
                    <div className="example-content">
                        <div className="example-text">
                            <h3>Request Body</h3>

                            <h4>
                                <span className="red">[string]</span>
                                baseAmount
                            </h4>
                            <p>
                                The base amount of coins. Denominate a double as a string.
                            </p>
                            <h4>
                                <span className="red">[string]</span>
                                baseAddress
                            </h4>
                            <p>
                                The base address to initiate the atomic swap with.
                            </p>
                            <h4>
                                <span className="red">[string]</span>
                                swapAmount
                            </h4>
                            <p>
                                The swap amount of coins. Denominate a double as a string.
                            </p>
                            <h4>
                                <span className="red">[string]</span>
                                swapAddress
                            </h4>
                            <p>
                                The swap address to initiate the atomic swap with.
                            </p>

                            <h3>Request Response</h3>

                            <h4>
                                <span className="red">[string]</span>
                                status
                            </h4>
                            <p>
                                Show that the contract completed
                            </p>

                            <h4>
                                <span className="red">[string]</span>
                                swapId
                            </h4>
                            <p>
                                The id of the atomic swap. To be used to check the status of the swap.
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
