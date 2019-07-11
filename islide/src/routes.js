const fs = require('fs');
var path = require('path');
var path = require('path');
const util = require('util');
const readdir = util.promisify(fs.readdir);

async function getSlides(allFiles = []) {
  const dirname = 'dist/slides';
  const url = 'slides';
  const files = (await readdir(dirname)).map(file => {
    return path.join(url, file);
  });
  allFiles.push(...files);
  console.log('files', allFiles);
  return allFiles;
}

module.exports = function(app) {
  app.get('/slides', async function(req, res) {
    const data = await getSlides();
    await res.setHeader('Content-Type', 'application/json');
    await res.end(JSON.stringify(data));
  });

  app.get('/remote', function(req, res) {
    if (process.env.ENV === 'dev') {
      res.sendFile(path.join(__dirname, '../dist/remote', 'index.html'));
    } else if (process.env.ENV === 'int') {
      res.sendFile(__dirname, '../dist/remote/index.html');
    }
  });

  app.get('*', function(req, res) {
    if (process.env.ENV === 'dev') {
      res.sendFile(path.join(__dirname, '../dist/screen', 'index.html'));
    } else if (process.env.ENV === 'int') {
      res.sendFile(__dirname, '../dist/screen/index.html');
    }
  });
};
