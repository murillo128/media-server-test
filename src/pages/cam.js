import React from 'react';
import Transport from '../components/transport';

export default class Cam extends React.Component {

    constructor(props, b) {
        super();

        const roomName = props.match.params.roomname;
        const stream = null;

        this.state = {
            roomName,
            stream
        }
    }

    componentWillMount() {

       this.transport = new Transport();
       this.transport.once('open', () => {

           if (!window.RTCPeerConnection) {

           }
       });

    }

    render() {

        const title = `On Cam Page for ${this.state.roomName}`;

        return (<div>
            <div>{title}</div>
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
        </div>);
    }
}