console.log("rts/ws")

const wss = require("../configs/websocket");
const wsController = require("../controllers/websocket");



wss.on('connection', function connection(ws) {
  ws.isAlive = true;
  ws.on('pong', heartbeat);
  console.log("connected");

  wsController.makeConnection(ws);

  ws.on('message', function incoming(data) {
    wsController.subscribeForTrades(ws, data);
  });
});

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) wsController.closeConnection(ws);

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);
