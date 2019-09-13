const router = require('express').Router()
const authRoutes = require('../auth/routes/routes')

router.use('/auth', authRoutes)

module.exports = router;