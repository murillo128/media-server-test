import React from 'react';
import { Header } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

export default class Home extends React.PureComponent {

    constructor () {
        super();

        this.state = {
            broadcasting: null
        }
    }

    broadcast () {
        this.setState({broadcasting: true});
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