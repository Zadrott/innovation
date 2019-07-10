process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var fs = require('fs');
var https = require('https');
var path = require('path');
const util = require('util');
const readdir = util.promisify(fs.readdir);

var express = require('express');
var app = express();

app.use(express.static(path.join(__dirname, 'dist')));
app.use('/slides', express.static(path.join(__dirname, 'dist/slides')));
app.use(express.static(path.join(__dirname, '../iremote/build')));
app.use(express.static(path.join(__dirname, '../iscreen/build')));

async function getSlides(allFiles = []) {
  const dirname = 'dist/slides';
  const url = 'slides';
  const files = (await readdir(dirname)).map(file => {
    return path.join(url, file);
  });
  allFiles.push(...files);
  return allFiles;
}

var options = {
  key: fs.readFileSync('./file.pem'),
  cert: fs.readFileSync('./file.crt'),
};

if (process.env.ENV === 'dev') {
  var serverPort = 3001;
} else if (process.env.ENV === 'int') {
  var serverPort = 443;
}

var server = https.createServer(options, app);
var io = require('socket.io')(server);

app.get('/slides', async function(req, res) {
  const data = await getSlides();
  await res.setHeader('Content-Type', 'application/json');
  await res.end(JSON.stringify(data));
});

app.get('/screen', function(req, res) {
  if (process.env.ENV === 'dev') {
    res.sendFile(path.join(__dirname, '../iscreen/build', 'index.html'));
  } else if (process.env.ENV === 'prod') {
    res.sendFile(__dirname + '/dist/screen/index.html');
  }
});

app.get('*', function(req, res) {
  if (process.env.ENV === 'dev') {
    res.sendFile(path.join(__dirname, '../iremote/build', 'index.html'));
  } else if (process.env.ENV === 'prod') {
    res.sendFile(__dirname + '/dist/remote/index.html');
  }
});

const remote = io.of('/remote');
const screen = io.of('/screen');

const getY = function(beta) {
  const MAX_Y_ANGLE = 10;
  if (
    (beta > 0 && beta <= MAX_Y_ANGLE) ||
    (beta < 0 && beta >= MAX_Y_ANGLE * -1)
  ) {
    return (100 / MAX_Y_ANGLE) * (beta * -1);
  } else {
    if (beta > 0) {
      return -100;
    } else {
      return 100;
    }
  }
};

const getX = function(alpha) {
  var MAX_X_ANGLE = 10;

  // Left/right rotation.
  if (alpha > 360 - MAX_X_ANGLE) {
    // phone is rotating right:
    return (100 / MAX_X_ANGLE) * (360 - alpha);
  } else if (alpha < MAX_X_ANGLE) {
    // phone is rotating left:
    return (100 / MAX_X_ANGLE) * (0 - alpha);
  } else {
    // Stop rotation at max angle.
    if (alpha > MAX_X_ANGLE && alpha < 180) {
      return -100;
    } else {
      return 100;
    }
  }
};

remote.on('connection', function(socket) {
  console.log('new REMOTE connection' + socket.id);
  socket.emit('message', 'remote side.');

  socket.on('position', function(gyroscope) {
    const newPosition = {
      alpha: gyroscope.alpha,
      beta: gyroscope.beta,
      gamma: gyroscope.gamma,
      x: getX(gyroscope.alpha),
      y: getY(gyroscope.beta),
    };
    screen.emit('position', newPosition);
  });

  socket.on('slideIndex', function(slide) {
    console.log('slideIndex', slide);
    screen.emit('slideIndex', slide.index);
  });
});

screen.on('connection', function(socket) {
  console.log('new SCREEN connection' + socket.id);
  socket.emit('message', 'screen side');
});

server.listen(serverPort, function() {
  console.log('server up and running at %s port', serverPort);
});
