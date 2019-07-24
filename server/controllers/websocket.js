const binance = require("../routes/binance");

module.exports.subscribe = function subscribe(ws, data) {
  console.log("subscribing");
  const type = data.split("@")[1];
  switch (type) {
    case "trades": {
      binance.trades(ws, data.split("@")[0]);
      break;
    }
    case "kline_1m": {
      binance.candlesticks(ws, data.split("@")[0]);
      break;
    }
  }

}

module.exports.unsubscribe = function unsubscribe(ws, data) {
  console.log("unsubscribing");
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

// Обработка полученных сообщений
module.exports.handleRequest = function handleRequest(ws, data) {
  console.log(data);
  const message = JSON.parse(data);
  switch(message.type) {
    case "sub": {
      this.subscribe(ws, message.data);
      break;
    }
    case "unsub": {
      this.unsubscribe(ws, message.data);
      break;
    }
  }
}
