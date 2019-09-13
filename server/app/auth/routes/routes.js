const router = require('express').Router()
const loginController = require('../controllers/login')
const registerController = require('../controllers/register')

router.post('/login', loginController)

router.post('/register', registerController)

module.exports = router;