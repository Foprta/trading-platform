console.log("rts/bnc")

const Binance = require("../models/BinanceClient");
const Connection = require("../models/Connection");

connections = [];

let makers = 0;
let takers = 0;

module.exports.create = function create(ws) {
  let client = new Binance("oUGIeAs0ese9RdCl7r8rnSGdIPXFmRS2YehwYvsuFt8Md1lGBCOsuMEbFuCc4ttR","nLcfHThpppewHeFm3yeWf4qkjjBj29VvIoNkhwaXopygiKefnV6NhQqJRkRAmXlX", ws).connection;
  connections.push(new Connection(ws, client));
}

module.exports.trades = function trades(ws, data) {
  let client = connections.find((e) => e.ws === ws);

  client.subscriptions.push(data.toLowerCase()+"@trades");

  client.binance.websockets.trades(data, (trades) => {
    let {e: eventType, E: eventTime, s: symbol, p: price, q: quantity, m: maker, a: tradeId} = trades;
    maker ? makers += parseFloat(quantity) : takers += parseFloat(quantity);
    client.ws.send(`[${symbol}] makers = ${makers.toFixed(4)}; takers = ${takers.toFixed(4)}`);
  })
}
