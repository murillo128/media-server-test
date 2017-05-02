import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, Link } from 'react-router';

import './App.css';
import RoomList from './pages/roomlist';
import Broadcast from './pages/broadcast';

import { Nav, Navbar, NavItem, Button, NavLink } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class App extends React.PureComponent {

    render() {

        let component = this.props.children || <Broadcast />;

        return (
          <div className="App">

              {/*<Navbar>*/}
                  {/*<Navbar.Header>*/}
                      {/*<Navbar.Brand>*/}
                          {/*<a href="/">Medooze Media Server Example</a>*/}
                      {/*</Navbar.Brand>*/}
                  {/*</Navbar.Header>*/}
                  {/*<Nav>*/}
                      {/*/!*<LinkContainer to="/broadcast">*!/*/}
                          {/*/!*<NavItem>Broadcast</NavItem>*!/*/}
                      {/*/!*</LinkContainer>*!/*/}
                      {/*/!*<LinkContainer to="/roomlist">*!/*/}
                          {/*/!*<NavItem>RoomList</NavItem>*!/*/}
                      {/*/!*</LinkContainer>*!/*/}
                  {/*</Nav>*/}
              {/*</Navbar>*/}

              {component}

          </div>
        );
    }
}

// ReactDOM.render(<Router history={browserHistory}>
//     <Route path='/' component={App}>
//         <Route path='broadcast' component={Broadcast}></Route>
//         <Route path='roomlist' component={RoomList}></Route>
//     </Route>
// </Router>, document.getElementById('root'));




