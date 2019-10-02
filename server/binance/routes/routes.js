const router = require('express').Router()
const controller = require('../controllers/data')
const connection = require('../../models/Connection')
const CandlesticksOptions = require('../models/CandlesticksOptions')

router.use('*', createBinanceConnection);

/**
 * Creates res.binance connection with User's API from JWT Token
 *
 * @param {*} req
 * @param {*} res
 */
async function createBinanceConnection(req, res) {
    res.binance = await connection(req.user._id);
    if (res.binance) req.next()
    else req.next('Cannot connect to Binance')
}

router.post('/candlesticks', (req, res) => {
    const options = new CandlesticksOptions(req.body.symbol, req.body.time)
    controller.candlesticks(res, options)
})

module.exports = router;