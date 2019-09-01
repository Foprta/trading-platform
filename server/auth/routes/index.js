var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var ctrlAuth = require('../controllers/authentication');

router.post('/login', ctrlAuth.login);

//router.post('/reg', ctrlAuth.reg);

module.exports = router;