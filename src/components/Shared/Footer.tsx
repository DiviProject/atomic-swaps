import logo from '../../assets/logo.png';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Footer extends Component {
    public constructor(props: any) {
        super(props);
    }

    public render() {
        return(
            <footer>
                <div className="wrapper">
                    <div className="fhead">
                        <img src={logo} alt="logo" title="logo" />
                        <h3>Atomic Swaps</h3>
                    </div>
                    <div className="menu-items">
                        <Link className="link" to="/">Home</Link>
                        <Link className="link" to="/api">API Reference</Link>
                        <Link className="link" to="/examples">Examples</Link>
                        <Link className="link" to="/godoc">GoDoc Reference</Link>
                    </div>
                </div>
            </footer>
        );
    }
}