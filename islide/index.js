process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const setup = require('./src/setup');
const routes = require('./src/routes');
const socket = require('./src/socket');

const app = express();

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'dist', 'screen')));
app.use(express.static(path.join(__dirname, 'dist', 'remote')));

const server = setup(app);

const io = socketIO(server);
routes(app);
socket(io);

if (process.env.ENV === 'dev') {
  var serverPort = 3001;
} else if (process.env.ENV === 'int') {
  var serverPort = 443;
}

server.listen(serverPort, function() {
  console.log('server up and running at %s port', serverPort);
});
