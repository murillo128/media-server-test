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

    destroy (cb) {
        this.setState({broadcasting:false}, cb);
    }

    broadcast () {
        this.setState({broadcasting: true});

        this.transport = new Transport();
        this.transport.once('open', () => {

            if (!window.RTCPeerConnection) {
                return this.destroy();
            }

            const pc = this.localPC = new RTCPeerConnection({
                bundlePolicy: "max-bundle",
                rtcpMuxPolicy : "require"
            });

            pc.onaddstream = (event) => {
                console.debug("onAddStream",event);
            };

            pc.onremovestream = () => {
                console.debug("onRemoveStream",event);
            };

            pc.createOffer({
                offerToReceiveVideo: true
            }).then((offer) => {
                console.debug("createOffer sucess",offer);
                const sdp = offer.sdp;
                pc.setLocalDescription(offer);
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
            this.state.broadcastStream = this.localPC.setRemoteDescription(new RTCSessionDescription({
                type: 'answer',
                sdp: answer
            })).then(() => {
                console.log('Joined the stream')
            }).catch((err) => {
                console.error('Error Joining stream')
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
            audio: true,
            video: true
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
                    this.state.broadcasting !== true ?
                    <Button onClick={broadcastOnClick}>Broadcast Stream</Button>
                    :'Broadcasting...'
                }

            </div>

        );
    }
}