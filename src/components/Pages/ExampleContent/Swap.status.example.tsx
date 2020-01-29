import React, { Component } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';

export const SwapHTTP = `$ curl -d -X GET http://localhost:3000/v1/swap/:swapId`;

export const SwapJSON = `{
    "status": "complete",
    "baseStatus": "complete",
    "swapStatus": "complete",
    "baseAddress": "1A1zsatoshiefi2DMPpoopamotomv7DivfNa",
    "swapAddress": "1A1zsatoshiefi2DMPpoopamotomv7DivfNa",
    "baseContract": "1A1zsatoshiefi2DMPpoopamotomv7DivfNa",
    "swapContract": "1A1zsatoshiefi2DMPpoopamotomv7DivfNa",
    "baseTransaction": "0x000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
    "swapTransaction": "0x000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
    "baseRedeemTransaction": "0x000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
    "swapRedeemTransaction": "0x000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
}`;

export class SwapStatusExample extends Component {
    public constructor(props: any) {
        super(props);
        this.state = { menu: false };
    }

    public render() {
        return(
            <div className="example-wrap" id="e11">
                <h2>Checking the status</h2>
                <div className="example">
                    <div className="example-content">
                        <div className="example-text">
                            <p>
                                To check the status of your atomic swap. You will need to query the atomic swap node with the
                                id given when initiating the swap.
                            </p>
                        </div>
                        <CodeMirror
                            value={SwapHTTP}
                            options={{
                                mode: 'shell',
                                theme: 'material',
                                lineNumbers: true
                            }}
                        />
                        <div className="example-text">
                            <p>
                                If the server is able to find the swap. You will receive the related addresses and contract
                                transactions. It will display "pending" or "complete" based on when the transactions have
                                been executed.
                            </p>
                        </div>
                        <CodeMirror
                            value={SwapJSON}
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
