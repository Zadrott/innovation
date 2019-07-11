var express = require('express');
var fs = require('fs');
var https = require('https');

module.exports = function(app) {
  var options = {
    key: fs.readFileSync('./file.pem'),
    cert: fs.readFileSync('./file.crt'),
  };

  return https.createServer(options, app);
};
