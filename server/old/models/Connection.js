class Connection {
  constructor(ws, binanceClient) {
    this.binance = binanceClient;
    this.ws = ws;
    this.symbols = {};
  }
}

module.exports = Connection;
