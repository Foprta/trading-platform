console.log("mdls/cnctn")

class Connection {
  constructor(ws, binanceClient) {
    this.binance = binanceClient;
    this.ws = ws;
    this.subscriptions = [];
  }
}

module.exports = Connection;
