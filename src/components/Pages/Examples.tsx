import './Examples.scss';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { UnControlled as CodeMirror } from 'react-codemirror2';

export class Examples extends Component {
    public constructor(props: any) {
        super(props);
        this.state = { menu: false };
    }

    public render() {
        return(
            <div className="page-wrap page-examples">
                <h2>How to use Atomic Swaps</h2>
                <div className="example">
                    <h3>Initiating an atomic swap</h3>
                    <div className="example-buttons">
                        <a className="example-button active">
                            CLI
                        </a>
                        <a className="example-button">
                            HTTP
                        </a>
                    </div>

                    <div className="example-content">
                        <div className="example-text">
                            <p>
                                In order to start an atomic swap. You need to provide
                                an address that is associated with the RPC node you
                                are using (see the configuration section).
                            </p>
                            <p>
                                You also need to provide an amount (in the RPC currency's value)
                                to keep in the atomic swap contract.
                            </p>
                        </div>
                        <CodeMirror
                            value='$ atomicswap initiate [address] [amount]
$ Do you want to publish this transaction? [y/N]
$ yes'
                            options={{
                                mode: 'shell',
                                theme: 'material',
                                lineNumbers: true
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }
}