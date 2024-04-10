const fs = require('fs');

function setup(peliasConfig, cssMapFile) {

  // read file with the map css
  const css = fs.readFileSync(cssMapFile, 'utf8').trim();

  // send HTML
  return function controller(req, res) {
    res.setHeader('Content-Type', 'text/css');
    res.send(css);
  };
}

module.exports = setup;
