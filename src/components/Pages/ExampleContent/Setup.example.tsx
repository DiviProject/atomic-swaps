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
                <h2>Setting up a gRPC + HTTP Server</h2>
                <div className="example">
                    <div className="example-content">
                        <div className="example-text">
                            <p>
                                Setting up an Atomic Swap server is pretty straight forward. It would be best if you run it only `atomicswap` binary. Just be sure to have the right configuration setup.
                            </p>
                            <p>
                                You can pass the config flag or other flags to configure the atomic swaps accordingly.
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
