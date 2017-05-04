import React from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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

        const onClick = (key) => {
            console.log(`on click ${key}`);
        };

        const listing = this.state.listing;
        const rooms = Object.keys(listing).map(function(key, index) {
            return (<div>
                <Link to={`/cam/${key}`} >
                    <Button key={index} >{key}</Button>
                </Link>
            </div>);
        });

        return (<div>Room List
            {rooms}
        </div>);
    }

}