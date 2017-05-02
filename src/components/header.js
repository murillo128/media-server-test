import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem, } from 'react-bootstrap';


const Header = () => (

    <Navbar>
        <Navbar.Header>
            <Navbar.Brand>
                <a href="#">React-Bootstrap</a>
            </Navbar.Brand>
        </Navbar.Header>
        <Nav>
            <LinkContainer to="/roomlist">
                <NavItem eventKey={1} >RoomList</NavItem>
            </LinkContainer>
            <LinkContainer to="/broadcast">
                <NavItem eventKey={2} >Broadcast</NavItem>
            </LinkContainer>
            <LinkContainer to="/login">
                <NavItem eventKey={3} >Login</NavItem>
            </LinkContainer>

        </Nav>
    </Navbar>
);

module.exports = Header;