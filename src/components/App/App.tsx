import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Header } from '../Shared/Header';
import { Footer } from '../Shared/Footer';

import { Home } from '../Pages/Home';
import { How } from '../Pages/How';
import { Examples } from '../Pages/Examples';
import { Api } from '../Pages/Api';

export class App extends Component {
  public constructor(props: any) {
    super(props);
  }

  public render() {
    return(
      <Router>
        <Header/>
        <div className="container">
          <Switch>
            <Route path="/examples"><Examples/></Route>
            <Route path="/api"><Api/></Route>
            <Route path="/how-it-works"><How/></Route>
            <Route path="/"><Home/></Route>
          </Switch>
        </div>
        <Footer/>
      </Router>
    );
  }
}

export default App;
