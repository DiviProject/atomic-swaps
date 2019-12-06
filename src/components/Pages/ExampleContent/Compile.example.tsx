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
                <h2>Compiling the Atomic Swap Binary</h2>
                <div className="example">
                    <div className="example-content">
                        <div className="example-text">
                            <p>
                                Compiling the Atomic Swap binary requires Go 1.1 or higher. Ideally, you also have glide as well too. And you should probably be using a Unix based system.
                            </p>
                            <p>
                                You can pass the config flag with the path to the atomicswap.json file or other flags to configure the atomic swaps accordingly.
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
                    </div>
                </div>
            </div>
        );
    }
}
