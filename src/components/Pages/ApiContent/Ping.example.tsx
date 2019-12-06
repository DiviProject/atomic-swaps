import React, { Component } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

export type PingProps = {

};

export type PingState = {
    example: number;
};

export const PingHTTP = `$ curl -d \\
$ -H "Content-Type: application/json" \\
$ -X POST http://localhost:3000/v1/ping`;

export const PingProto = `syntax = "proto3";
package api;

import "google/api/annotations.proto";

message ServerRequest {

}

message ServerResponse {
  string ping = 1;
  int64 time = 2;
}

service Server {
  rpc server(ServerRequest) returns (ServerResponse) {
    option (google.api.http) = {
      post: "/v1/ping"
      body: "*"
    };
  }
}`;

export class PingApi extends Component<PingProps, PingState> {
    public constructor(props: any) {
        super(props);
        this.state = { example: 0 };
    }

    public returnExample() {
        if (this.state.example === 0) {
            return PingHTTP;
        } else {
            return PingProto;
        }
    }

    public render() {
        return(
            <div className="example-wrap" id="e0">
                <h2>
                    <span className="bold">[POST]</span>
                    /v1/ping
                </h2>
                <div className="example">
                    <div className="example-content">
                        <div className="example-text">
                            <h3>Request Response</h3>

                            <h4>
                                <span className="red">[string]</span>
                                ping
                            </h4>
                            <p>
                                Simply just returns the key "ping" with a value of "pong".
                            </p>
                            <h4>
                                <span className="red">[int64]</span>
                                time
                            </h4>
                            <p>
                                Returns the current time in UNIX.
                            </p>
                        </div>
                    </div>

                    <div className="example-buttons">
                        <a className={`example-button ${this.state.example === 0 ? 'active' : ''}`} onClick={(() => this.setState({ example: 0 }))}>
                            HTTP
                        </a>
                        <a className={`example-button ${this.state.example === 1 ? 'active' : ''}`} onClick={(() => this.setState({ example: 1 }))}>
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
