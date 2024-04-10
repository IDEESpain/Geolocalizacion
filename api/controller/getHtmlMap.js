const fs = require('fs');

function setup(peliasConfig, htmlMapFile) {

  // read file with de html map
  const map = fs.readFileSync(htmlMapFile, 'utf8').trim();

  // send HTML
  return function controller(req, res) {
    res.send(map);
  };
}

module.exports = setup;
