import logo from '../../assets/logo.png';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export type HeaderProps = {

};

export type HeaderState = {
    menu: boolean;
};

export class Header extends Component<HeaderProps, HeaderState> {
    public constructor(props: any) {
        super(props);
        this.state = { menu: false };
    }

    public toggleMenu(e: any) {
        this.setState({ menu: !this.state.menu });
    }

    public render() {
        return(
            <header>
                <div className="wrapper">
                    <Link className="brand" to="/">
                        <img src={logo} alt="logo" title="logo"/>
                        <h1>Atomic Swaps</h1>
                    </Link>
                    <a className="menu-button" onClick={this.toggleMenu.bind(this)}>
                        <i className="fas fa-bars"></i>
                    </a>
                    <div className={`menu ${this.state.menu ? 'active' : ''}`} onClick={this.toggleMenu.bind(this)}>
                        <Link className="link" to="/">Home</Link>
                        <Link className="link" to="/how-it-works">How it Works</Link>
                        <Link className="link" to="/api">API Reference</Link>
                        <Link className="link" to="/examples">Examples</Link>
                        <Link className="link" to="/godoc">GoDoc Reference</Link>
                    </div>
                </div>
            </header>
        );
    }
}
