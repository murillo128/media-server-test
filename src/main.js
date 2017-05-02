import React from 'react';
import { Route, Switch } from 'react-router-dom';
import RoomList from './pages/roomlist';
import Broadcast from './pages/broadcast';
import Login from './pages/login';
import Cam from './pages/cam';

export default class Main extends React.Component {

    render() {

        return (<main>
            <Switch>
                <Route exact path="/" component={RoomList} />
                <Route path='/roomlist' component={RoomList}/>
                <Route path='/broadcast' component={Broadcast} />
                <Route path='/login' component={Login} />
                <Route path='/cam/:roomname' component={Cam} />
            </Switch>
        </main>);
    }
}

module.exports = Main;