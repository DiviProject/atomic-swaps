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

export class AuditExample extends Component<AuditProps, AuditState> {
    public constructor(props: any) {
        super(props);
        this.state = { example: 0 };
    }

    public render() {
        return(
            <div className="example-wrap" id="e8">
                <h2>Auditing an atomic swap</h2>
                <div className="example">
                    <div className="example-buttons">
                        <a className={`example-button ${this.state.example === 0 ? 'active' : ''}`} onClick={(() => this.setState({ example: 0 }))}>
                            CLI
                        </a>
                        <a className={`example-button ${this.state.example === 1 ? 'active' : ''}`} onClick={(() => this.setState({ example: 1 }))}>
                            HTTP
                        </a>
                    </div>
                    <div className="example-content">
                        <div className="example-text">
                            <p>
                                If you want to review or verify the contents of an atomic swap contract. You can use the audit command. This command outputs all related information in regards to the atomic swap.
                            </p>
                            <p>
                            A connection to the RPC node that has the address and private key associated with the atomic swap contract is required to execute a refund successfully.
                            </p>
                        </div>
                        <CodeMirror
                            value={this.state.example === 0 ? AuditCLI : AuditHTTP}
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
