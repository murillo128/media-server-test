const http = require('http');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const app = express();
const log = require('./log');
const ws = require('./ws');
const MediaServer = require('./medooze');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/dist', express.static(path.join(__dirname, '..', 'dist')));

// copied over from media-server-demo
// is this the best way to get the IP?
if (process.argv.length !=3 )
    throw new Error("Missing IP address\nUsage: node index.js <ip>"+process.argv.length);
//Get ip
const ip = process.argv[2];

let port = process.env.PORT;
let server;
if (process.env.ENABLE_SSL) {
  server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, '..', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '..', 'cert.pem'))
  }, app);
  port = port || 8443;
} else {
  server = http.createServer(app);
  port = port || 8080;
}

const mediaServer = new MediaServer(ip);

app.get('/', (req, res) => {
  if (process.env.NODE_ENV !== 'production') {
      res.redirect('http://localhost:3000/');
  }

  // TODO: else load out of build folder

});

app.get('/api/roomlist', (req, res) => {
  res.send({listing: mediaServer.listRooms()});
});

const wss = ws(server, mediaServer);

server.listen(port, "0.0.0.0", () => {
  log.info('server started', { port });
});