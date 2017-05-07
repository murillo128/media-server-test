import React from 'react';
import Transport from '../components/transport';

export default class Cam extends React.Component {

    constructor(props, b) {
        super();

        const roomName = props.match.params.roomname;
        const remoteStream = null;

        this.state = {
            roomName,
            remoteStream
        }
    }

    componentWillMount() {
        let pc = null;
        this.transport = new Transport();
        this.transport.once('open', () => {


            pc = new RTCPeerConnection({
                bundlePolicy: "max-bundle",
                rtcpMuxPolicy: "require"
            });

            pc.onaddstream = (event) => {
                this.setState({remoteStream: event.stream});
                console.log("onAddStream", event);
            };

            pc.createOffer({
                offerToReceiveVideo: true
            }).then((offer) => {

                console.debug("createOffer sucess", offer);
                const sdp = offer.sdp;
                pc.setLocalDescription(new RTCSessionDescription(offer));
                console.debug("offset set as local description", offer);
                this.transport.send({
                    event: 'requestToViewBroadcast',
                    sdp,
                    roomName: this.state.roomName
                });

            });
        });

        this.transport.on('viewableBroadcast', (answer) => {
debugger
            pc.setRemoteDescription(new RTCSessionDescription({
                type: 'answer',
                sdp: answer
            })).then(() => {
                console.log('Joined the stream');
            }).catch((err) => {
                console.error('Error Joining stream');
            })

        });
    }
    render() {

        const title = `On Cam Page for ${this.state.roomName}`;

        return (<div>
            <div>{title}</div>
            <div>
            {
                this.state.remoteStream ? (

                    <video autoPlay={true} ref={(e) => {
                        if (!this.qq && e) {
                            this.qq = e;
                        }

                        console.log('remote stream', this.state.remoteStream)

                        this.qq.srcObject = this.state.remoteStream;
                    }}></video>
                ) : null
            }

            </div>
        </div>);
    }
}