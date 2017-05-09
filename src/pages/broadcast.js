import React from 'react';
import { Header, Button } from 'react-bootstrap';
import Transport from '../components/transport';

export default class Broadcast extends React.Component {

    constructor () {
        super();

        this.state = {
            broadcasting: null,
            stream: null,
            remoteStream: null
        }
    }

    destroy (cb) {
        this.setState({broadcasting:false}, cb);
    }

    broadcast () {
        this.setState({broadcasting: true});

        let pc = null;

        this.transport = new Transport();
        this.transport.once('open', () => {

            pc = new RTCPeerConnection({
                bundlePolicy: "max-bundle",
                rtcpMuxPolicy : "require"
            });

            pc.addStream(this.state.stream);

            pc.onaddstream = (event) => {
                this.setState({remoteStream: event.stream});
                console.log("onAddStream",event);
            };

            pc.onremovestream = () => {
                console.log("onRemoveStream",event);
            };

            pc.createOffer({
                offerToReceiveVideo: true
            }).then((offer) => {

                console.debug("createOffer sucess",offer);
                const sdp = offer.sdp;
                pc.setLocalDescription(new RTCSessionDescription(offer));
                console.debug("offset set as local description", offer);
                this.transport.send({
                    event: 'broadcast',
                    sdp
                });

            }).catch((error) => {
                console.error("Error broadcasting video", error);
            })
        });

        this.transport.on('broadcasting', (answer) => {
            pc.setRemoteDescription(new RTCSessionDescription({
                type: 'answer',
                sdp: answer
            })).then(() => {
                console.log('Joined the stream');
            }).catch((err) => {
                console.error('Error Joining stream');
            })
        });

        this.transport.on('error', (err) => {
            console.log('error opening transport', err);
            this.destroy();
        });
        this.transport.on('close', () => {
          this.destroy()
        });

    }

    componentWillMount() {
        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                width: { min: 480, ideal: 480, max: 1920 },
                height: { min: 320, ideal: 320, max: 1080 }
            }
        }).then((stream) => {
            this.setState({stream});
        }).catch((err) => {
            console.log(err);
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

                        <video width="480" height="320" autoPlay={true} ref={(e) => {
                            if (!this.previewEl && e) {
                                this.previewEl = e;
                            }
                            this.previewEl.srcObject = this.state.stream;
                        }}></video>
                    ) : null
                }
                </div>

                {
                    this.state.broadcasting !== true ?
                        (
                            <Button onClick={broadcastOnClick}>Broadcast Stream</Button>
                        ) :
                        (
                            <video width="480" height="320" autoPlay={true} ref={(e) => {
                                if (!this.el && e) {
                                    this.el = e;
                                }
                                this.el.srcObject = this.state.remoteStream;
                            }}></video>
                        )

                }

            </div>

        );
    }
}