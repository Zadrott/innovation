const {Gyroplane} = require('./gyroplane');

console.log(Gyroplane);

module.exports = function(io) {
  const remote = io.of('/remote');
  const screen = io.of('/screen');

  remote.on('connection', function(socket) {
    console.log('new REMOTE connection' + socket.id);
    socket.emit('message', 'remote side.');

    socket.on('position', function(gyroscope) {
      const newPosition = {
        alpha: gyroscope.alpha,
        beta: gyroscope.beta,
        gamma: gyroscope.gamma,
        x: Gyroplane.getX(gyroscope.alpha),
        y: Gyroplane.getY(gyroscope.beta),
      };
      screen.emit('position', newPosition);
    });

    socket.on('slideIndex', function(slide) {
      console.log('slideIndex', slide);
      screen.emit('slideIndex', slide.index);
    });

    socket.on('displayPointer', function(display) {
      console.log('display', display);
      screen.emit('display', display);
    });
  });

  screen.on('connection', function(socket) {
    console.log('new SCREEN connection' + socket.id);
    socket.emit('message', 'screen side');
  });
};
