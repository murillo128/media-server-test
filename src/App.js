import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import './App.css';
import RoomList from './pages/roomlist';
import Broadcast from './pages/broadcast';

import { Nav, Navbar, NavItem } from 'react-bootstrap';

export default class App extends React.PureComponent {

    render() {

        let component = this.props.children || <RoomList />;

        return (
          <div className="App">

              <Navbar>
                  <Navbar.Header>
                      <Navbar.Brand>
                          <a href="#">Medooze Media Server Example</a>
                      </Navbar.Brand>
                  </Navbar.Header>
                  <Nav>
                      <NavItem eventKey={1} href="/roomlist">Room List</NavItem>
                      <NavItem eventKey={2} href="/broadcast">Broadcast</NavItem>
                  </Nav>
              </Navbar>

              {component}

          </div>
        );
    }
}

ReactDOM.render(<Router history={browserHistory}>
    <Route path='/' component={App}>
        <Route path='broadcast' component={Broadcast}></Route>
        <Route path='roomlist' component={RoomList}></Route>
    </Route>
</Router>, document.getElementById('root'));




