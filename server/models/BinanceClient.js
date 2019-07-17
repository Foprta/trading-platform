class BinanceClient {
  constructor(key, secret, ws) {
    this.connection = require("node-binance-api")().options({
      APIKEY: key,
      APISECRET: secret,
      reconnect: false,
      useServerTime: true // If you get timestamp errors, synchronize to server time at startup
    });
    this.ws = ws;
  }
}

module.exports = BinanceClient;
