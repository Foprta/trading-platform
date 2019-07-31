const binance = require("../routes/binance");

module.exports.subscribe = function subscribe(ws, data) {
  const type = data.type;
  switch (type) {
    case "trades": {
      binance.trades(ws, data.symbol);
      break;
    }
    case "kline": {
      binance.candlestick(ws, data.symbol, data.candlesTime);
      break;
    }
  }
}

module.exports.unsubscribe = function unsubscribe(ws, data) {
  binance.unsub(ws, data.symbol, data.type, data.candlesTime);
}

module.exports.get = function get(ws, data) {
  const type = data.type;
  switch (type) {
    case "candlesticks": {
      binance.candlesticks(ws, data.symbol, data.candlesTime, data.endTime);
      break;
    }
  }
}

module.exports.makeConnection = function makeConnection(ws) {
  binance.create(ws);
}

module.exports.closeConnection = function closeConnection(ws) {
  binance.close(ws);
}

// Обработка полученных сообщений
module.exports.handleRequest = function handleRequest(ws, data) {
  data = JSON.parse(data);
  const message = data.data;
  switch (data.type) {
    case "sub": {
      this.subscribe(ws, message);
      break;
    }
    case "unsub": {
      this.unsubscribe(ws, message);
      break;
    }
    case "get": {
      this.get(ws, message);
      break;
    }
  }
}
