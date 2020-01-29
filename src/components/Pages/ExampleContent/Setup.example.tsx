import React, { Component } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

export class SetupExample extends Component {
    public constructor(props: any) {
        super(props);
        this.state = { menu: false };
    }

    public render() {
        return(
            <div className="example-wrap" id="e2">
                <h2>Running a Node</h2>
                <div className="example">
                    <div className="example-content">
                        <div className="example-text">
                            <p>
                                Assuming that you have successfully compiled the atomic swap binary.
                                And, that you also have access to RPC nodes for Bitcoin and Divi.
                                You can run an atomic swap node. This atomic swap node can be hosted
                                locally on your own machine. Or it can be hosted in the cloud.
                                The flexibility of the atomic swap reflects the flexibility of a
                                Bitcoin or Divi full node.
                            </p>
                        </div>
                        <CodeMirror
                            value='$ atomicswap --config /path/to/.atomicswap.json
$ Starting gRPC Server on port 9001
$ Starting HTTP Server on port 9000'
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
