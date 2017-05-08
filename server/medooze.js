// --- This encapsilation will be used to
const medoozeMediaServer = require('medooze-media-server');
//Get Semantic SDP objects
const SemanticSDP	= require("semantic-sdp");
const SDPInfo		= SemanticSDP.SDPInfo;
const MediaInfo		= SemanticSDP.MediaInfo;
const CandidateInfo	= SemanticSDP.CandidateInfo;
const DTLSInfo		= SemanticSDP.DTLSInfo;
const ICEInfo		= SemanticSDP.ICEInfo;
const StreamInfo	= SemanticSDP.StreamInfo;
const TrackInfo		= SemanticSDP.TrackInfo;
const Direction		= SemanticSDP.Direction;
const CodecInfo		= SemanticSDP.CodecInfo;

module.exports = class MediaServer {

    constructor(publicIp) {

        const enableDebug = process.env.Node_ENV !== 'production';
        medoozeMediaServer.enableDebug(enableDebug);

        this.ip = publicIp;
        this.endpoint = medoozeMediaServer.createEndpoint(publicIp);

        this.rooms = {};

        this.streamer = medoozeMediaServer.createStreamer();
    }

    listRooms() {
        return this.rooms;
    }

    viewBroadcastStream(id, offerSdp) {

        const roomData = this.rooms[id];
        const incomingStreams = roomData.incomingStreams;
        const videoOffer = roomData.videoOffer;
        const audioOffer = roomData.audioOffer;

        const offer = SDPInfo.process(offerSdp);
        //Create an DTLS ICE transport in that enpoint
        const transport = this.endpoint.createTransport({
            dtls : offer.getDTLS(),
            ice  : offer.getICE()
        });

        let answer = new SDPInfo();

        const dtls = transport.getLocalDTLSInfo();
        const ice  = transport.getLocalICEInfo();

        //Add ice and dtls info
        answer.setDTLS(dtls);
        answer.setICE(ice);

        //Get local candidates
        const candidates = this.endpoint.getLocalCandidates();

        for (let i=0;i<candidates.length;++i)
            //Add candidate to media info
            answer.addCandidate(candidates[i]);

        //If offer had video
        if (audioOffer)
        {
            //Create video media
            let  audio = new MediaInfo(audioOffer.getId(), "audio");
            //Set recv only
            audio.setDirection(Direction.INACTIVE);
            //Add it to answer
            answer.addMedia(audio);
        }

        //If offer had video
        if (videoOffer)
        {
            //Create video media
            let  video = new MediaInfo(videoOffer.getId(), "video");

            //Get codec types
            let h264 = videoOffer.getCodec("h264");
            //Add video codecs
            video.addCodec(h264);
            //Set recv only
            video.setDirection(Direction.SENDONLY);
            //Add it to answer
            answer.addMedia(video);
        }

        //Set RTP local  properties
        transport.setLocalProperties({
            audio : answer.getMedia("audio"),
            video : answer.getMedia("video")
        });


        for (let incomingStream of incomingStreams)
        {
            //Create new local stream with only video
            const outgoingStream  = transport.createOutgoingStream({
                audio: false,
                video: true
            });

            //Get local stream info
            const info = outgoingStream.getStreamInfo();

            //Copy incoming data from the remote stream to the local one
            outgoingStream.attachTo(incomingStream);

            //Add local stream info it to the answer
            answer.addStream(info);

        }

        return answer.toString();

    }

    viewRTPBroadcastStream(offerSDP, port) {

        const videoPort = 5004;

        const receiver = {};

        //Create new video session codecs
        const video = new MediaInfo("video", "video");

        //Add h264 codec
        video.addCodec(new CodecInfo("h264", 96));

        //Create session for video
        receiver.video = this.streamer.createSession(video, {
            local  : {
                port: videoPort
            }
        });

        //Process the sdp
        const offer = SDPInfo.process(offerSDP);

        //Create an DTLS ICE transport in that enpoint
        const transport = this.endpoint.createTransport({
            dtls : offer.getDTLS(),
            ice  : offer.getICE()
        });

        //Set RTP remote properties
        transport.setRemoteProperties({
            audio : offer.getMedia("audio"),
            video : offer.getMedia("video")
        });

        //Get local DTLS and ICE info
        const dtls = transport.getLocalDTLSInfo();
        const ice  = transport.getLocalICEInfo();

        //Get local candidates
        const candidates = this.endpoint.getLocalCandidates();

        //Create local SDP info
        const answer = new SDPInfo();

        //Add ice and dtls info
        answer.setDTLS(dtls);
        answer.setICE(ice);
        //For each local candidate
        for (let i=0;i<candidates.length;++i)
            //Add candidate to media info
            answer.addCandidate(candidates[i]);

        //Get remote video m-line info
        const videoOffer = offer.getMedia("video");

        //If offer had video
        if (videoOffer)
        {
            //Create video media
            const video = new MediaInfo(videoOffer.getId(), "video");

            //Get codec types
            const h264 = videoOffer.getCodec("h264");
            //Add video codecs
            video.addCodec(h264);
            //Set send only
            video.setDirection(Direction.RECVONLY);
            //Add it to answer
            answer.addMedia(video);
        }

        //Set RTP local  properties
        transport.setLocalProperties({
            video : answer.getMedia("video"),
            audio: answer.getMedia("audio")
        });

        //Create new local stream to send to browser
        const outgoingStream  = transport.createOutgoingStream({
            audio: false,
            video: true
        });

        //Copy incoming data from the broadcast stream to the local one
        outgoingStream.getVideoTracks()[0].attachTo(receiver.video.getIncomingStreamTrack());

        //Get local stream info
        const info = outgoingStream.getStreamInfo();

        //Add local stream info it to the answer
        answer.addStream(info);

        return answer.toString();

    }

    broadcastStream(id, offerSdp) {

        const broadcast = {};

        //Create new video session codecs
        const video = new MediaInfo("video","video");

        //Add h264 codec
        video.addCodec(new CodecInfo("h264",96));

        const offer = SDPInfo.process(offerSdp);
        //Create an DTLS ICE transport in that enpoint
        const transport = this.endpoint.createTransport({
            dtls : offer.getDTLS(),
            ice  : offer.getICE()
        });

        transport.setRemoteProperties({
            audio : offer.getMedia("audio"),
            video : offer.getMedia("video")
        });

        //Get local DTLS and ICE info
        const dtls = transport.getLocalDTLSInfo();
        const ice  = transport.getLocalICEInfo();

        //Get local candidates
        const candidates = this.endpoint.getLocalCandidates();

        let answer = new SDPInfo();

        //Add ice and dtls info
        answer.setDTLS(dtls);
        answer.setICE(ice);

        for (let i=0;i<candidates.length;++i)
            //Add candidate to media info
            answer.addCandidate(candidates[i]);

        //Get remote video m-line info
        let audioOffer = offer.getMedia("audio");

        //If offer had video
        if (audioOffer)
        {
            //Create video media
            let  audio = new MediaInfo(audioOffer.getId(), "audio");
            //Set recv only
            audio.setDirection(Direction.INACTIVE);
            //Add it to answer
            answer.addMedia(audio);
        }

        //Get remote video m-line info
        let videoOffer = offer.getMedia("video");

        //If offer had video
        if (videoOffer)
        {
            //Create video media
            let  video = new MediaInfo(videoOffer.getId(), "video");

            //Get codec types
            let h264 = videoOffer.getCodec("h264");
            //Add video codecs
            video.addCodec(h264);
            //Set recv only
            video.setDirection(Direction.SENDRECV);
            //Add it to answer
            answer.addMedia(video);

            const ip = this.ip;
            const port = 5004;

            // --- Setup RTP Video Session
            broadcast.video = this.streamer.createSession(video, {
                remote: {
                    ip,
                    port
                }
            })
        }

        //Set RTP local  properties
        transport.setLocalProperties({
            audio : answer.getMedia("audio"),
            video : answer.getMedia("video")
        });

        this.rooms[id] = {
            id,
            transport,
            videoOffer,
            audioOffer,
            incomingStreams: [],
            broadcast
        };

        for (let offered of offer.getStreams().values())
        {
            //Create the remote stream into the transport
            const incomingStream = transport.createIncomingStream(offered);

            this.rooms[id].incomingStreams.push(incomingStream);

            //Create new local stream with only video
            const outgoingStream  = transport.createOutgoingStream({
                audio: false,
                video: true
            });

            //Get local stream info
            const info = outgoingStream.getStreamInfo();

            //Copy incoming data from the remote stream to the local one
            outgoingStream.attachTo(incomingStream);

            // --- Populate the RTP Stream
            broadcast.video.getOutgoingStreamTrack().attachTo(incomingStream.getVideoTracks()[0]);

            //Add local stream info it to the answer
            answer.addStream(info);

        }

        return answer.toString();
    }
};


