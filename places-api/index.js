const app = require('./app'),
  port = (process.env.PORT || 4600),
  host = (process.env.HOST || undefined);

const FgBlack = "\x1b[30m";
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const FgYellow = "\x1b[33m";
const FgBlue = "\x1b[34m";
const FgMagenta = "\x1b[35m";
const FgCyan = "\x1b[36m";
const FgWhite = "\x1b[37m";

const server = app.listen(port, host, () => {
  // ask server for the actual address and port its listening on
  const listenAddress = server.address();
  console.log(FgGreen + 'info:' + FgWhite, '[places-api]', `Places API is now running on http://${listenAddress.address}:${listenAddress.port}`);
});

function exitHandler() {
  console.log(FgRed + 'exit:' + FgWhite, '[places-api]', 'Places API shutting down');

  server.close();
}

process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);
