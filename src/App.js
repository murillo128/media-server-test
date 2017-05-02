import React from 'react';

import './App.css';

import Header from './components/header';
import Main from './main';

export default class App extends React.Component {

    render() {

        return (
          <div>
              <Header />
              <Main />
          </div>
        );
    }
}





