import React, { Component } from 'react';

import { CompileExample } from './ExampleContent/Compile.example';
import { ConfigExample } from './ExampleContent/Config.example';
import { SetupExample } from './ExampleContent/Setup.example';
import { ExecutionExample } from './ExampleContent/Execution.example';
import { InitiateExample } from './ExampleContent/Initiate.example';
import { ParticipateExample } from './ExampleContent/Participate.example';
import { RedeemExample } from './ExampleContent/Redeem.example';
import { RefundExample } from './ExampleContent/Refund.example';
import { AuditExample } from './ExampleContent/Audit.example';

import { SwapExample } from './ExampleContent/Swap.example';
import { SwapStatusExample } from './ExampleContent/Swap.status.example';

export type ExamplesProps = {

};

export type ExamplesState = {
    active: number;
};

export class Examples extends Component<ExamplesProps, ExamplesState> {
    public constructor(props: any) {
        super(props);
        this.state = { active: 0 };
    }

    public scrollEvent(e: any) {
        const e0: any = document.querySelector('div#e0');
        const e1: any = document.querySelector('div#e1');
        const e2: any = document.querySelector('div#e2');
        const e3: any = document.querySelector('div#e3');
        const e4: any = document.querySelector('div#e4');
        const e5: any = document.querySelector('div#e5');
        const e6: any = document.querySelector('div#e6');
        const e7: any = document.querySelector('div#e7');
        const e8: any = document.querySelector('div#e8');

        const e10: any = document.querySelector('div#e10');
        const e11: any = document.querySelector('div#e11');

        if (e0 && e10) {
            if (e0.getBoundingClientRect().bottom - 50 > 0) {
                this.setState({ active: 0 });
            } else if (e1.getBoundingClientRect().bottom - 50 > 0) {
                this.setState({ active: 1 });
            } else if (e2.getBoundingClientRect().bottom - 50 > 0) {
                this.setState({ active: 2 });
            } else if (e3.getBoundingClientRect().bottom - 50 > 0) {
                this.setState({ active: 3 });
            } else if (e10.getBoundingClientRect().bottom - 50 > 0) {
                this.setState({ active: 10 });
            } else if (e11.getBoundingClientRect().bottom - 50 > 0) {
                this.setState({ active: 11 });
            } else if (e4.getBoundingClientRect().bottom - 50 > 0) {
                this.setState({ active: 4 });
            } else if (e5.getBoundingClientRect().bottom - 50 > 0) {
                this.setState({ active: 5 });
            } else if (e6.getBoundingClientRect().bottom - 50 > 0) {
                this.setState({ active: 6 });
            } else if (e7.getBoundingClientRect().bottom - 50 > 0) {
                this.setState({ active: 7 });
            } else if (e8.getBoundingClientRect().bottom - 50 > 0) {
                this.setState({ active: 8 });
            }
        }
    }

    public scrollTo(element: any, e: any) {
        const el: any = document.querySelector(element);
        const top = el.offsetTop - 30;

        window.scrollTo({
           left: 0,
           top,
           behavior: 'smooth',
        });
    }

    public componentDidMount() {
        window.addEventListener('scroll', this.scrollEvent.bind(this));
    }

    public componentWillUnmount() {
        window.removeEventListener('scroll', this.scrollEvent.bind(this));
    }

    public render() {
        return(
            <div className="page-wrap page-examples">
                <div className="page-column table-of-contents">
                    <h3>Getting Started</h3>
                    <a className={`link ${this.state.active === 0 ? 'active' : ''}`} onClick={this.scrollTo.bind(this, 'div#e0')}>
                        0. Compilation
                    </a>
                    <a className={`link ${this.state.active === 1 ? 'active' : ''}`} onClick={this.scrollTo.bind(this, 'div#e1')}>
                        1. Configuration
                    </a>
                    <a className={`link ${this.state.active === 2 ? 'active' : ''}`} onClick={this.scrollTo.bind(this, 'div#e2')}>
                        2. Setting up a gRPC Server
                    </a>
                    <a className={`link ${this.state.active === 3 ? 'active' : ''}`} onClick={this.scrollTo.bind(this, 'div#e3')}>
                        3. Executing via command line
                    </a>

                    <h3>Automated Examples</h3>
                    <a className={`link ${this.state.active === 10 ? 'active' : ''}`} onClick={this.scrollTo.bind(this, 'div#e10')}>
                        0. Initiating an atomic swap
                    </a>
                    <a className={`link ${this.state.active === 11 ? 'active' : ''}`} onClick={this.scrollTo.bind(this, 'div#e11')}>
                        1. Check the status
                    </a>

                    <h3>Extended Examples</h3>
                    <a className={`link ${this.state.active === 4 ? 'active' : ''}`} onClick={this.scrollTo.bind(this, 'div#e4')}>
                        0. Initiating an Atomic Swap
                    </a>
                    <a className={`link ${this.state.active === 5 ? 'active' : ''}`} onClick={this.scrollTo.bind(this, 'div#e5')}>
                        1. Participating in an Atomic Swap
                    </a>
                    <a className={`link ${this.state.active === 6 ? 'active' : ''}`} onClick={this.scrollTo.bind(this, 'div#e6')}>
                        2. Redeeming an Atomic Swap
                    </a>
                    <a className={`link ${this.state.active === 7 ? 'active' : ''}`} onClick={this.scrollTo.bind(this, 'div#e7')}>
                        3. Refunding an Atomic Swap
                    </a>
                    <a className={`link ${this.state.active === 8 ? 'active' : ''}`} onClick={this.scrollTo.bind(this, 'div#e8')}>
                        4. Auditing an Atomic Swap
                    </a>
                </div>

                <div className="page-column primary">
                    <h2 className="title">Getting Started</h2>
                    <CompileExample/>
                    <ConfigExample/>
                    <SetupExample/>
                    <ExecutionExample/>
                    <h2 className="title">Automated Examples</h2>
                    <SwapExample/>
                    <SwapStatusExample/>
                    <h2 className="title">Extended Examples</h2>
                    <InitiateExample/>
                    <ParticipateExample/>
                    <RedeemExample/>
                    <RefundExample/>
                    <AuditExample/>
                </div>
            </div>
        )
    }
}
