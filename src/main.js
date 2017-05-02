import React from 'react';
import { Route, Switch } from 'react-router-dom';
import RoomList from './pages/roomlist';
import Broadcast from './pages/broadcast';
import Login from './pages/login';

const Main = () => (
    <main>
        <Switch>
            <Route exact path="/" component={RoomList} />
            <Route path='/roomlist' component={RoomList}/>
            <Route path='/broadcast' component={Broadcast}/>
            <Route path='/login' component={Login} />
        </Switch>
    </main>
)

module.exports = Main;