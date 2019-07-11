const express = require('express');
const fs = require('fs');
const https = require('https');

module.exports = function(app) {
  const options = {
    key: fs.readFileSync('./file.pem'),
    cert: fs.readFileSync('./file.crt'),
  };

  return https.createServer(options, app);
};
