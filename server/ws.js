const uuid = require('uuid');
const WebSocket = require('ws');
const log = require('./log');

const createWebSocketServer = (server, mediaServer) => {

    const WebSocketServer = WebSocket.Server;
    const wss = new WebSocketServer({
        server
    });

    wss.on('connection', (ws) => {
       const send = (d) => {
        ws.send(JSON.stringify(d));
       };

       ws.uuid = uuid.v4();
       send({ uuid: ws.uuid });

       ws.on('message', (message) => {
           let parsedMessage;

           try {
               parsedMessage = JSON.parse(message);
           } catch(err) {
               log.error('failed to parse message', { message });
               return;
           }

           switch (parsedMessage.event) {
               case 'login':
                   console.log('login message received');
                   break;

               case 'broadcast':
                   // --- Start the stream here
                   const sdp = parsedMessage.sdp;

                   const answer = mediaServer.broadcastStream(ws.uuid, sdp);
                   send({broadcastResponse: answer});
                   break;
           }
       })
    });
};

module.exports = createWebSocketServer;