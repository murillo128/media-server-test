import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (

    <header>
        <nav>
            <ul>
                <li><Link to='/roomlist'>Room List</Link></li>
                <li><Link to='/broadcast'>Broadcast</Link></li>
                <li><Link to='/login'>Login</Link></li>
            </ul>
        </nav>
    </header>
);

module.exports = Header;