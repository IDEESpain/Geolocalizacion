var pkg = require('../package');

function middleware(req, res, next){
  res.header('Charset','utf8');
  res.header('Cache-Control','public');
  res.header('Server', 'PlacesAPI/'+pkg.version);
  res.header('X-Powered-By', 'iderioja');
  next();
}

module.exports = middleware;
