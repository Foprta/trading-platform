const binance = require("../routes/binance");

module.exports.subscribe = function(ws, data) {
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

module.exports.unsubscribe = function(ws, data) {
  binance.unsub(ws, data.symbol, data.type, data.candlesTime);
}

module.exports.getData = function(ws, data) {
  const type = data.type;
  switch (type) {
    case "candlesticks": {
      binance.candlesticks(ws, data.symbol, data.candlesTime, data.endTime);
      break;
    }
    case "balance": {
      binance.balance(ws);
      break;
    }
  }
}

module.exports.makeConnection = function(ws) {
  binance.create(ws);
}

module.exports.closeConnection = function(ws) {
  binance.close(ws);
}

// Обработка полученных сообщений
module.exports.handleRequest = function(ws, data) {
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
      this.getData(ws, message);
      break;
    }
    case "balance": {
      this.getData(ws, message);
      break;
    }
  }
}
