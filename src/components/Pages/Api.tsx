import React, { Component } from 'react';

import { PingApi } from './ApiContent/Ping.example';
import { InitiateApi } from './ApiContent/Initiate.example';
import { ParticipateApi } from './ApiContent/Participate.example';
import { RedeemApi } from './ApiContent/Redeem.example';
import { RefundApi } from './ApiContent/Refund.example';
import { AuditApi } from './ApiContent/Audit.example';

import { SwapApi } from './ApiContent/Swap.example';
import { SwapStatusApi } from './ApiContent/Swap.status.example';

export type ApiProps = {

};

export type ApiState = {
    active: number;
};

export class Api extends Component<ApiProps, ApiState> {
    public constructor(props: any) {
        super(props);
        this.state = { active: 10 };
    }

    public scrollEvent(e: any) {
        const e0: any = document.querySelector('div#e0');
        const e1: any = document.querySelector('div#e1');
        const e2: any = document.querySelector('div#e2');
        const e3: any = document.querySelector('div#e3');
        const e4: any = document.querySelector('div#e4');
        const e5: any = document.querySelector('div#e5');

        const e10: any = document.querySelector('div#e10');
        const e11: any = document.querySelector('div#e11');

        if (e0 && e10) {
            if (e10.getBoundingClientRect().bottom - 50 > 0) {
                this.setState({ active: 10 });
            } else if (e11.getBoundingClientRect().bottom - 50 > 0) {
                this.setState({ active: 11 });
            } else if (e0.getBoundingClientRect().bottom - 50 > 0) {
                this.setState({ active: 0 });
            } else if (e1.getBoundingClientRect().bottom - 50 > 0) {
                this.setState({ active: 1 });
            } else if (e2.getBoundingClientRect().bottom - 50 > 0) {
                this.setState({ active: 2 });
            } else if (e3.getBoundingClientRect().bottom - 50 > 0) {
                this.setState({ active: 3 });
            } else if (e4.getBoundingClientRect().bottom - 50 > 0) {
                this.setState({ active: 4 });
            } else if (e5.getBoundingClientRect().bottom - 50 > 0) {
                this.setState({ active: 5 });
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
                    <h3>Automated API</h3>
                    <a className={`link bold ${this.state.active === 10 ? 'active' : ''}`} onClick={this.scrollTo.bind(this, 'div#e10')}>
                        <span className="yellow">[POST]</span>
                        /v1/swap
                    </a>
                    <a className={`link bold ${this.state.active === 11 ? 'active' : ''}`} onClick={this.scrollTo.bind(this, 'div#e11')}>
                        <span className="blue">[GET]</span>
                        /v1/swap/:id
                    </a>
                    <h3>Extended API</h3>
                    <a className={`link bold ${this.state.active === 0 ? 'active' : ''}`} onClick={this.scrollTo.bind(this, 'div#e0')}>
                        <span className="yellow">[POST]</span>
                        /v1/ping
                    </a>
                    <a className={`link bold ${this.state.active === 1 ? 'active' : ''}`} onClick={this.scrollTo.bind(this, 'div#e1')}>
                        <span className="yellow">[POST]</span>
                        /v1/initiate
                    </a>
                    <a className={`link bold ${this.state.active === 2 ? 'active' : ''}`} onClick={this.scrollTo.bind(this, 'div#e2')}>
                        <span className="yellow">[POST]</span>
                        /v1/participate
                    </a>
                    <a className={`link bold ${this.state.active === 3 ? 'active' : ''}`} onClick={this.scrollTo.bind(this, 'div#e3')}>
                        <span className="yellow">[POST]</span>
                        /v1/redeem
                    </a>
                    <a className={`link bold ${this.state.active === 4 ? 'active' : ''}`} onClick={this.scrollTo.bind(this, 'div#e4')}>
                        <span className="yellow">[POST]</span>
                        /v1/refund
                    </a>
                    <a className={`link bold ${this.state.active === 5 ? 'active' : ''}`} onClick={this.scrollTo.bind(this, 'div#e5')}>
                        <span className="yellow">[POST]</span>
                        /v1/audit
                    </a>
                </div>

                <div className="page-column primary">
                    <h2 className="title">Automated API</h2>
                    <SwapApi/>
                    <SwapStatusApi/>
                    <h2 className="title">Extended API</h2>
                    <PingApi/>
                    <InitiateApi/>
                    <ParticipateApi/>
                    <RedeemApi/>
                    <RefundApi/>
                    <AuditApi/>
                </div>
            </div>
        )
    }
}
