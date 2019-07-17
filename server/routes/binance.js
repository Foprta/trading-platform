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
    console.log(e);
  }
}

module.exports.unsub = function unsub(ws, d) {
  const index = connections.findIndex((e) => e.ws === ws);
  console.log(d);
  try {
    connections[index].binance.websockets.terminate(d);
    delete connections[index].symbols[d.split("@")[0]];
  }
  catch (e) {
    console.log(e);
  }
}

module.exports.candles = function candles(ws, data) {
  let client = connections.find((e) => e.ws === ws);

  client.symbols[data.split("@")[0]] = {makers: 0, takers: 0};

console.log(data.split("@")[0]);

  client.binance.candlesticks(data.split("@")[0].toUpperCase(), "5m", (error, ticks, symbol) => {
    console.log("candlesticks()", ticks);
    let last_tick = ticks[ticks.length - 1];
    let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;
    console.log(symbol+" last close: "+close);
  }, {limit: 500});
}

module.exports.trades = function trades(ws, data) {
  let client = connections.find((e) => e.ws === ws);

  client.symbols[data.split("@")[0]] = {makers: 0, takers: 0};

  client.binance.websockets.trades(data.split("@")[0], (trades) => {
    let {e: eventType, E: eventTime, s: symbol, p: price, q: quantity, m: maker, a: tradeId} = trades;
    if (maker) {
      client.symbols[symbol.toLowerCase()].makers += parseFloat(quantity);
    } else {
      client.symbols[symbol.toLowerCase()].takers += parseFloat(quantity);
    }

    ws.send(`{"symbol" : "${symbol}",  "makers" : "${client.symbols[symbol.toLowerCase()].makers.toFixed(4)}" , "takers" : "${client.symbols[symbol.toLowerCase()].takers.toFixed(4)}"}`);
  })
}
