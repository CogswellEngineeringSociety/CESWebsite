import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Navigationbar from './site_constants/navbar';
import './ButtonStyles.css';

import {
  BrowserRouter as Router,
  Link,
  Route,
  hashHistory

} from 'react-router-dom';

class App extends Component {

  render() {
    return (
      
        <Navigationbar/>
    );
  }
}

export default App;
