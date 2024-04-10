const app = require('express')();
const compression = require('compression');

// Enable compression
app.use(compression());

/** ----------------------- pre-processing-middleware ----------------------- **/

app.use(require('./middleware/headers'));
app.use(require('./middleware/cors'));
app.use(require('./middleware/robots'));
app.use(require('./middleware/options'));
app.use(require('./middleware/jsonp'));

/** ----------------------- routes ----------------------- **/


const defaultRoutes = require('./routes/default');
defaultRoutes.addRoutes(app);


/** ----------------------- error middleware ----------------------- **/

app.use(require('./middleware/404'));
app.use(require('./middleware/500'));

module.exports = app;
