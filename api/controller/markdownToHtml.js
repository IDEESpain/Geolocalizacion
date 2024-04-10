const markdown = require('markdown').markdown;
const fs = require('fs');

function setup(peliasConfig, markdownFile) {

  // read markdown
  const md = fs.readFileSync(markdownFile, 'utf8').trim();

  // convert to HTML
  const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Servicio SCNE - Instituto Geográfico Nacional</title>
    <style>html { font-family:monospace; }</style>
  </head>
  <body>
    <!-- ${markdown.toHTML(md)} -->
    <h1>Servicio SCNE - Instituto Geográfico Nacional</h1>
    <h3>Version: <a href="https://github.com/pelias/api/releases">v5.43.0</a></h3>
    <h2><a href="https://github.com/pelias/documentation/">View our documentation on GitHub</a></h2>
  </body>
</html>`.trim();

  // send HTML
  return function controller(req, res) {
    res.send(html);
  };
}

module.exports = setup;
