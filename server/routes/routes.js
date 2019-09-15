const router = require('express').Router()
const binanceRoutes = require('../binance/routes/routes')

router.all('/binance', binanceRoutes)

module.exports = router;