const wss = require("../configs/websocket");
const wsController = require("../controllers/websocket");

wss.on('connection', function connection(ws) {
  ws.isAlive = true;

  wsController.makeConnection(ws);

  ws.on('message', function(data) {
    if (JSON.parse(data) === 'pong') {
      heartbeat(ws);
    }
    else {
      wsController.handleRequest(ws, data);
    }
  });

  ws.on('close', function() {
    wsController.closeConnection(ws);
  })
});

function heartbeat(ws) {
  ws.isAlive = true;
}

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) {
      wsController.closeConnection(ws);
      console.log("closed with pong");
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.send('"ping"');
  });
}, 5000);

