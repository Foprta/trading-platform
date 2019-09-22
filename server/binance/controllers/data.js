module.exports.candlesticks = async function (res, options) {
    console.log('jopa')
    res.binance.candlesticks(options.symbol, options.time, (error, ticks, symbol) => {
        res.send({sa: ticks})
    });
}