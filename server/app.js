const express = require('express');
const path = require("path");
const passport = require('./app/auth/passport/config')
const authRoutes = require('./app/auth/routes/routes')
const securedRoutes = require('./routes/routes')
const bodyParser = require('body-parser');
require('./mongoose/index') // Подключение к БД

const app = express();

const distDir="../dist/trading-platform";

app.use(express.static(path.join(__dirname, distDir)));

app.use(passport.initialize());

app.use(bodyParser.json());

app.use('/auth', authRoutes);

app.use('/secured', passport.authenticate('jwt', {session: false}), securedRoutes);

app.all('*', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, distDir) + "/index.html");
});

module.exports = app;