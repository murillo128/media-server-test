import React from 'react';

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

        const peerConnectionConfig = {
            'iceServers': [
                {'urls': 'stun:stud.services.mozilla.com'},
                {'urls': 'stun:stun.l.google.com:19302'}
            ]
        };

        const onIceCandidate = (event) => {
            if (event.candidate !== null) {

            }
        };

        const onAddStream = () => {

        };

        const peerConnection = new window.RTCPeerConnection(peerConnectionConfig);
        peerConnection.onicecandidate = onIceCandidate;
        peerConnection.onaddstream = onAddStream;




        // --- Setup Websocket

        // --- Setup Peer connection

        // --- Add callbacks to render stream to the remote video

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