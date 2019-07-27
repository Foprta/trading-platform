const Binance = require("../models/BinanceClient");
const Connection = require("../models/Connection");

connections = [];

module.exports.create = function create(ws) {
  let client = new Binance("6BrCAotfakqRF0sQd9EilaqgLfjfJrhHaeIhiCyy3ybWbiw2nSjTaWkZWkqMAwHs", "Mwq1unpyjg4SgvAsb57LyRzMLLN0Br09sCaMIRKN4Ac72matRVery4LtFbo1oJnn", ws).connection;
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

module.exports.unsub = function unsub(ws, d) {
  const index = connections.findIndex((e) => e.ws === ws);
  try {
    connections[index].binance.websockets.terminate(d.toLowerCase());
  }
  catch (e) {
    console.error(e);
  }
}

module.exports.candlesticks = function candlesticks(ws, data, settings) {
  let client = connections.find((e) => e.ws === ws);

  try {
    client.binance.candlesticks(data.split("@")[0], "1m", (error, ticks, symbol) => {
      if (error) {
        console.error(error);
        this.candlesticks(ws, data, settings);
      } else {
        try {
          ws.send(JSON.stringify({type: "candlesticks", data: ticks}));
        } catch(e) {
          console.error(e);
        }
      }
    }, {limit: 500, endTime: settings || undefined});
  } catch(e) {
    console.error(e)
  }
}

module.exports.candlestick = function candlestick(ws, data) {
  let client = connections.find((e) => e.ws === ws);

  try {
    client.binance.websockets.candlesticks(data.split("@")[0], "1m", candlestick => {
      try {
        ws.send(JSON.stringify({type: "candlestick", data: candlestick}));
      } catch(e) {
        client.binance.websockets.terminate(data);
      }
    })
  } catch(e) {
    console.error(e)
  }

} 

module.exports.trades = function trades(ws, data) {
  let client = connections.find((e) => e.ws === ws);

  client.binance.websockets.trades(data.split("@")[0], (trades) => {
    let {e: eventType, E: eventTime, s: symbol, p: price, q: quantity, m: maker, a: tradeId} = trades;
    ws.send(JSON.stringify({type: "trades", data: {maker: trades.maker, quantity: trades.quantity}}));
  })
}
