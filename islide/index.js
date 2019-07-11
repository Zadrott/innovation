process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var express = require('express');
var socketIO = require('socket.io');
var path = require('path');

var setup = require('./src/setup');
var routes = require('./src/routes');
var socket = require('./src/socket');

var app = express();

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'dist', 'screen')));
app.use(express.static(path.join(__dirname, 'dist', 'remote')));

var server = setup(app);

var io = socketIO(server);
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
