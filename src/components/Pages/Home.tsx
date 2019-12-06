import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import divi from '../../assets/logo.png';
import bitcoin from '../../assets/bitcoin.png';

export class Home extends Component {
    public constructor(props: any) {
        super(props);
    }

    public render() {
        return(
            <div className="page-wrap page-home">
                <h2>Atomic Swaps</h2>
                <h3>An easy to use gRPC and HTTP API to create and interact with Atomic Swap contracts for Bitcoin</h3>

                <div className="banner">
                    <img src={divi} className="divi"/>
                    <i className="fas fa-chevron-right"></i>
                    <i className="fas fa-chevron-right"></i>
                    <i className="fas fa-chevron-right"></i>
                    <img src={bitcoin} className="bitcoin"/>
                </div>

                <div className="buttons">
                    <Link className="button" to="/how-it-works">
                        <i className="fas fa-question-circle"></i>
                        How it works
                    </Link>
                    <a className="button" href="https://diviproject.org" target="diviproject">
                        <i className="fas fa-sign-out-alt"></i>
                        Go to Divi
                    </a>
                </div>

                <div className="buttons">
                    <Link className="button" to="/examples">
                        <i className="fas fa-graduation-cap"></i>
                        Learn more
                    </Link>
                    <Link className="button" to="/api">
                        <i className="fas fa-book-open"></i>
                        API Reference
                    </Link>
                    <a className="button" href="https://github.com/DiviProject/atomic-swaps">
                        <i className="fab fa-github"></i>
                        Source on Github
                    </a>
                </div>
            </div>
        );
    }
}
