import React from 'react';
import axios from 'axios';

export default class RoomList extends React.Component {
    constructor() {
        super();

        this.state = {
            listing: {}
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

        const listing = this.state.listing;
        const rooms = Object.keys(listing).map(function(key) {
            return <div>Key: {key}, Value: {listing[key]}</div>;
        })
        return (<div>Room List
            {rooms}
        </div>);
    }

}