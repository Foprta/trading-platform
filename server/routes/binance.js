const Binance = require("../models/BinanceClient");
const Connection = require("../models/Connection");

connections = [];

module.exports.create = function (ws) {
  let client = new Binance("6BrCAotfakqRF0sQd9EilaqgLfjfJrhHaeIhiCyy3ybWbiw2nSjTaWkZWkqMAwHs", "Mwq1unpyjg4SgvAsb57LyRzMLLN0Br09sCaMIRKN4Ac72matRVery4LtFbo1oJnn").connection;
  connections.push(new Connection(ws, client));
}

module.exports.close = function (ws) {
  const index = connections.findIndex((e) => e.ws === ws);

  try {
    let endpoints = connections[index].binance.websockets.subscriptions();
    for (let endpoint in endpoints) {
      connections[index].binance.websockets.terminate(endpoint);
    }

    connections.splice(index, 1);
  }
  catch (e) {
    console.error(e);
  }
}

module.exports.unsub = function (ws, symbol, type, time) {
  const index = connections.findIndex((e) => e.ws === ws);
  try {
    console.log(symbol + "@" + type + "_" + time)
    connections[index].binance.websockets.terminate((symbol + "@" + type + "_" + time).toLowerCase());
  }
  catch (e) {
    console.error(e);
  }
}

module.exports.candlesticks = function (ws, symbol, time, endTime) {
  let client = connections.find((e) => e.ws === ws);

  try {
    client.binance.candlesticks(symbol, time, (error, ticks, symbol) => {
      if (error) {
        console.error(error);
        this.candlesticks(ws, symbol, time, endTime);
      } else {
        try {
          ws.send(JSON.stringify({ type: "candlesticks", symbol: symbol, time: time, data: ticks }));
        } catch (e) {
          console.error(e);
        }
      }
    }, { limit: 500, endTime: endTime || undefined });
  } catch (e) {
    console.error(e)
  }
}


module.exports.balance = function (ws) {
  let client = connections.find((e) => e.ws === ws);

  try {
    client.binance.useServerTime(function () {
      client.binance.balance((error, balances) => {
        if (error) {
          console.log(error.body);
          this.balance(ws);
        } else {
          try {
            ws.send(JSON.stringify({ type: "balance", data: balances }));
          } catch (e) {
            console.error(e)
          }
        }
      })
    })
  } catch (e) {
    console.error(e)
  }

}

module.exports.candlestick = function (ws, symbol, time) {
  let client = connections.find((e) => e.ws === ws);

  try {
    client.binance.websockets.candlesticks(symbol, time, candlestick => {
      try {
        ws.send(JSON.stringify({ type: "kline", symbol: symbol, time: time, data: candlestick }));
      } catch (e) {
        console.error(e)
        client.binance.websockets.terminate(symbol + "@kline_" + time);
      }
    })
  } catch (e) {
    console.error(e)
  }

}

module.exports.trades = function (ws, symbol) {
  let client = connections.find((e) => e.ws === ws);

  client.binance.websockets.trades(symbol, (trades) => {
    let { e: eventType, E: eventTime, s: symbol, p: price, q: quantity, m: maker, a: tradeId } = trades;
    ws.send(JSON.stringify({ type: "trades", symbol, data: { maker: trades.maker, quantity: trades.quantity } }));
  })
}
