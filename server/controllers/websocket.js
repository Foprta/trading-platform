const binance = require("../routes/binance");

module.exports.subscribeForTrades = function subscribeForTrades(ws, data) {
  console.log("gettingTrades");
  binance.candles(ws, data);
}

module.exports.unsubscribeFromTades = function unsubscribeFromTades(ws, data) {
  console.log("unsubGettingTrades");
  binance.unsub(ws, data);
}

module.exports.makeConnection = function makeConnection(ws) {
  console.log("creatingConnection");
  binance.create(ws);
}

module.exports.closeConnection = function closeConnection(ws) {
  console.log("closingConnection");
  binance.close(ws);
}

module.exports.handleRequest = function handleRequest(ws, data) {
  console.log(data);
  const message = JSON.parse(data);
  console.log("Handling Request");
  switch(message.type) {
    case "sub": {
      this.subscribeForTrades(ws, message.data);
      break;
    }
    case "unsub": {
      this.unsubscribeFromTades(ws, message.data);
      break;
    }
  }
}
