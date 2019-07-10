var express = require('express');
var path = require('path');
var fs = require('fs');
var https = require('https');

module.exports = function(app) {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.use(express.static(path.join(__dirname, '../../iremote/build')));
  app.use(express.static(path.join(__dirname, '../../iscreen/build')));

  var options = {
    key: fs.readFileSync('./file.pem'),
    cert: fs.readFileSync('./file.crt'),
  };

  return https.createServer(options, app);
};
