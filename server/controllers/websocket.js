console.log("ctrl/ws")

const binance = require("../routes/binance");

module.exports.subscribeForTrades = function subscribeForTrades(ws, data) {
  console.log("gettingTrades");
  binance.trades(ws, data);
}

module.exports.makeConnection = function makeConnection(ws) {
  console.log("creatingConnection");
  binance.create(ws);
}

module.exports.closeConnection = function closeConnection(ws) {
  console.log("creatingConnection");
  binance.create(ws);
}
