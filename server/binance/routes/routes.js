const router = require('express').Router()
const controller = require('../controllers/data')
const connection = require('../../models/Connection')

router.use('*', createBinanceConnection);

async function createBinanceConnection(req, res) {
    res.binance = await connection(req.user._id);
    if (res.binance) req.next()
    else req.next('Cannot connect to Binance')
}

router.post('/candles', (req, res) => {
    controller.prevDay(res, 'bnb')
})

module.exports = router;