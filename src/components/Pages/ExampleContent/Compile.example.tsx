import React, { Component } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

export class CompileExample extends Component {
    public constructor(props: any) {
        super(props);
        this.state = { menu: false };
    }

    public render() {
        return(
            <div className="example-wrap" id="e0">
                <h2>Setting up</h2>
                <div className="example">
                    <div className="example-content">
                        <div className="example-text">
                            <p>
                                Compiling the Atomic Swap binary requires Go 1.13. Atomic Swaps has been most extensively tested on UNIX based systems. While we do support
                                Windows based OSes, our primary goal is to support Debian and Mac OS based systems.
                            </p>
                            <p>
                                You can pass the config flag with the path to the atomicswap.json file or other flags to configure atomic swaps.
                                Check the configuration section to learn more about configuring your atomic swap node.
                            </p>
                        </div>
                        <CodeMirror
                            value='$ git clone https://github.com/DiviProject/atomic-swaps.git --depth 1 --branch master
$
$ cd atomic-swaps
$ export GO111MODULE=auto
$
$ go mod verify
$ go mod tidy
$
$ go build -i -o ./dist/atomicswap ./src/atomicswap.go
$
$ # You can now run the atomic swap binary
$ ./dist/atomicswap'
                            options={{
                                mode: 'shell',
                                theme: 'material',
                                lineNumbers: true
                            }}
                        />
                        <div className="example-text">
                            <p>
                                If you prefer Docker. We have a Docker image that can build and compile the base image.
                            </p>
                        </div>
                        <CodeMirror
                            value='$ docker build -t atomicswaps .
$ docker run atomicswaps
$ docker attach atomicswaps'
                            options={{
                                mode: 'shell',
                                theme: 'material',
                                lineNumbers: true
                            }}
                        />
                        <div className="example-text">
                            <p>
                                Before moving forward. You will need to setup full nodes for Bitcoin and Divi.
                                These full nodes must allow for the Atomic Swap node to interact with their RPC.
                                You cannot execute an atomic swap without full nodes for Bitcoin and Divi.
                                You must be able to interact with their RPC full nodes too.
                            </p>
                            <p>
                                You may need to bind the RPC server publically. This is only if the full nodes
                                are not located on your local computer. Use the <b>-rpcbind</b> flag, or, use
                                <b> rpcbind=IP</b> in your <b>.conf</b> files. Below illustrates how you can setup
                                the Bitcoin and Divi daemons with RPC flags to allow the Atomic Swap node to interact
                                with the app.
                            </p>
                        </div>
                        <CodeMirror
                            value={`$ # For Bitcoin
$ bitcoind -rest -server -daemon -rpcuser=bitcoin -rpcpassword=bitcoin -rpcport=8332 -rpcbind={THE ATOMIC SWAP IP/YOUR IP}
$ divid -rest -server -daemon -rpcuser=divi -rpcpassword=divi -rpcport=8332 -rpcbind={THE ATOMIC SWAP IP/YOUR IP}`}
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
