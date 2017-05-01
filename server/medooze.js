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

        this.endpoint = medoozeMediaServer.createEndpoint(publicIp);

        //Create new streamer
        const streamer = this.streamer = medoozeMediaServer.createStreamer();

        //Create new video session codecs
        const video = new MediaInfo("video","video");

        //Add h264 codec
        video.addCodec(new CodecInfo("h264",96));

        //Create session for video
        const session = this.session = streamer.createSession(video,{
            local  : {
                port: 5004
            }
        });

        this.roomList = {};
    }

    listRooms() {
        const listing = [];

        for (var k in this.roomList) {
            listing.push(k);
        }

        return { listing };
    }

    broadcastStream(sdp) {

        const offer = SDPInfo.process(sdp);
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
            video.setDirection(Direction.RECVONLY);
            //Add it to answer
            answer.addMedia(video);
        }

        //Set RTP local  properties
        transport.setLocalProperties({
            audio : answer.getMedia("audio"),
            video : answer.getMedia("video")
        });

        //Create new local stream with only video
        const outgoingStream  = transport.createOutgoingStream({
            audio: false,
            video: true
        });

        //Copy incoming data from the broadcast stream to the local one
        outgoingStream.getVideoTracks()[0].attachTo(this.session.getIncomingStreamTrack());

        //Get local stream info
        const info = outgoingStream.getStreamInfo();

        //Add local stream info it to the answer
        answer.addStream(info);

        return answer;
    }
};


