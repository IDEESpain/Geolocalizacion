const fs = require('fs');

function setup(peliasConfig, jsMapFile) {

  // read filehtml with map
  const js = fs.readFileSync(jsMapFile, 'utf8').trim();

  // send HTML
  return function controller(req, res) {
    res.setHeader('Content-Type', 'application/javascript');
    res.send(js);
  };
}

module.exports = setup;
