const Binance = require("../models/BinanceClient");
const Connection = require("../models/Connection");

connections = [];

module.exports.create = function create(ws) {
  let client = new Binance("6BrCAotfakqRF0sQd9EilaqgLfjfJrhHaeIhiCyy3ybWbiw2nSjTaWkZWkqMAwHs", "Mwq1unpyjg4SgvAsb57LyRzMLLN0Br09sCaMIRKN4Ac72matRVery4LtFbo1oJnn").connection;
  connections.push(new Connection(ws, client));
}

module.exports.close = function close(ws) {
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

module.exports.unsub = function unsub(ws, symbol, type, time) {
  const index = connections.findIndex((e) => e.ws === ws);
  try {
    connections[index].binance.websockets.terminate((symbol + "@" + type + "_" + time).toLowerCase());
  }
  catch (e) {
    console.error(e);
  }
}

module.exports.candlesticks = function candlesticks(symbol, time, endTime) {
  
}

module.exports.balance = function balance(ws) {
  let client = connections.find((e) => e.ws === ws);

  try {
    client.binance.useServerTime(function () {
      client.binance.balance((error, balances) => {
        if (error) {
          console.error(error.body);
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

module.exports.candlestick = function candlestick(ws, symbol, time) {
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

module.exports.trades = function trades(ws, symbol) {
  let client = connections.find((e) => e.ws === ws);

  client.binance.websockets.trades(symbol, (trades) => {
    let { e: eventType, E: eventTime, s: symbol, p: price, q: quantity, m: maker, a: tradeId } = trades;
    ws.send(JSON.stringify({ type: "trades", symbol, data: { maker: trades.maker, quantity: trades.quantity } }));
  })
}
