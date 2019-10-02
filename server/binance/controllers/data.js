/**
 * Loading candlesticks
 *
 * @param {*} res - HTTP Response
 * @param {*} options - params for loading candles
 */
module.exports.candlesticks = function (res, options) {
    res.binance.candlesticks(options.symbol.toUpperCase(), options.time, (error, ticks, symbol) => {
        if (error) {
            res.sendStatus(500);
        } else {
            res.send({ticks: ticks})
        }
    }, {limit: options.limit, endTime: options.endTime, startTime: options.startTime});
}