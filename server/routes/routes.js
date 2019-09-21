const router = require('express').Router()
const binanceRoutes = require('../binance/routes/routes')

router.use('/binance', binanceRoutes)

module.exports = router;