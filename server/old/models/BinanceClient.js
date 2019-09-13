class BinanceClient {
  constructor(key, secret) {
    this.connection = require("node-binance-api")().options({
      APIKEY: key,
      APISECRET: secret,
      reconnect: false,
      recvWindow: 60000,
      useServerTime: true // If you get timestamp errors, synchronize to server time at startup
    });
  }
}

module.exports = BinanceClient;
