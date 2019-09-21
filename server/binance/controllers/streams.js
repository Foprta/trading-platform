module.exports.unsubscribeAll = function (binance) {
    let endpoints = binance.websockets.subscriptions();
    for (let endpoint in endpoints) {
        binance.websockets.terminate(endpoint);
    }
}

module.exports.trade = function (socket, options) {
    socket.binance.websockets.trades(options.symbol, (trades) => {
        socket.emit(`${options.symbol}@trade`, trades)
    })
}

module.exports.kline = function (socket, options) {
    socket.binance.websockets.candlesticks(options.symbol, options.time, candlestick => {
        socket.emit(`${options.symbol}@kline_${options.time}`, candlestick);
    })
}

module.exports.unsubscribe = function (socket, subscription) {
    socket.binance.websockets.terminate(subscription);
}