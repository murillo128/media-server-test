import React from 'react';
import Transport from '../components/transport';

export default class ViewRTPCam extends React.Component {

    constructor(props, b) {
        super();

        const remoteStream = null;

        this.state = {
            remoteStream
        };
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

                console.debug("createOffer success", offer);
                const sdp = offer.sdp;
                pc.setLocalDescription(new RTCSessionDescription(offer));
                console.debug("offset set as local description", offer);
                this.transport.send({
                    event: 'requestToViewRTPBroadcast',
                    sdp,
                    port: 5004
                });

            });
        });

        this.transport.on('viewableRTPBroadcast', (answer) => {
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

        return (<div>
            <div>ViewRTPBroadcast</div>
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