import React from 'react';
import { Header, Button } from 'react-bootstrap';
import Transport from '../components/transport';

export default class Home extends React.PureComponent {

    constructor () {
        super();

        this.state = {
            broadcasting: null
        }
    }

    broadcast () {
        this.setState({broadcasting: true});
        this.transport = new Transport();

        this.transport.once('open', () => {

            console.log('Transport Open')
        });
    }

    componentWillMount() {
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        }).then((stream) => {
            debugger
            this.setState({stream});
        }).catch((err) => {
            console.log(err)
            this.error = err;
        });
    }

    render() {

        const broadcastOnClick = () => {
            this.broadcast();
        };

        return (
            <div>

                Local Stream from GetUserMedia
                <div>
                {
                    this.state.stream ? (

                        <video autoPlay={true} ref={(e) => {
                            if (!this.previewEl && e) {
                                this.previewEl = e;
                            }
                            this.previewEl.srcObject = this.state.stream;
                        }}></video>
                    ) : null
                }
                </div>

                {
                    this.state.broadcasting === null ?
                    <Button onClick={broadcastOnClick}>Broadcast Stream</Button>
                    :'Broadcasting...'
                }

            </div>

        );
    }
}