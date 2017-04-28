const http = require('http');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const app = express();
const log = require('./log');
const MediaServer = require('medooze-media-server');
const SemanticSDP	= require("semantic-sdp");

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/dist', express.static(path.join(__dirname, '..', 'dist')));

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
  debugger
  port = port || 8080;
}

app.get('/', (req, res) => {
  res.redirect('http://localhost:3000/');
});

const endpoint = MediaServer.createEndpoint(ip);

server.listen(port, "0.0.0.0", () => {
  log.info('server started', { port });
});