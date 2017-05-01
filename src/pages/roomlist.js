import React from 'react';
import axios from 'axios';

export default class RoomList extends React.PureComponent {
    constructor() {
        super();

        this.state = {
            listing: []
        }
    }

    componentWillMount() {

        axios.get('/api/roomlist').then((res) => {
            const listing = res.data.listing;

            if (listing) {
                this.setState({listing});
            }
        }).catch((err) => {

        });
    }

    render() {
        return (<div>Room List</div>);
    }

}