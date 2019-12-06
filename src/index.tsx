import './Styles/App.scss';

import 'react-codemirror2';
import 'codemirror/mode/shell/shell';
import 'codemirror/mode/javascript/javascript';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App/App';

import { unregister } from './serviceWorker';

ReactDOM.render(<App/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
unregister();
