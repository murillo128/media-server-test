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
        return (
            <div>
                <div>
                {
                    this.state.stream ? (

                        <video autoPlay={true} ref={(e) => {
                            if (!this.previewEl && e) {
                                this.previewEl = e;
                            }
                            debugger
                            this.previewEl.srcObject = this.state.stream;
                        }}></video>
                    ) : null
                }
                </div>

                { !this.state.broadcasting ?
                    <Button>Broadcast Stream</Button> :
                    'Broadcasting...'
                }

            </div>

        );
    }
}