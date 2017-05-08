import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import RoomList from './pages/roomlist';
import Broadcast from './pages/broadcast';
import Login from './pages/login';
import Cam from './pages/cam';
import ViewRTPCam from './pages/viewrtpcam';

import getUser from './components/user';

export default class Main extends React.Component {
    constructor() {
        super();
    }

    render() {
        const checkAuth = () => (
            getUser() ? (
                <Broadcast />
            ) : (
                <Redirect to='/login' />
            )
        )

        return (<main>
            <Switch>
                <Route exact path="/" component={RoomList} />
                <Route path='/roomlist' component={RoomList}/>
                <Route path='/broadcast' render={checkAuth} />
                <Route path='/login' component={Login} />
                <Route path='/cam/:roomname' component={Cam} />
                <Route path='/viewrtpcam' component={ViewRTPCam} />
            </Switch>
        </main>);
    }
}