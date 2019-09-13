const express = require("express");
const path = require("path");
const config = require("./configs/config.json");
const mongo = require("./configs/mongo");
const wss = require("./routes/websocket");
const passport = require("passport");
const bodyParser = require('body-parser');
const authRoute = require('./auth/routes/index')
require('./auth/configs/passport');

const app = express();

const distDir="../dist/trading-platform"

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, distDir)))

app.use(passport.initialize());

app.use('/auth', authRoute);

app.all('*', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, distDir)+"/index.html");
});

app.listen(config.port, () => {
  console.info(`server started on port ${config.port}`);
});

module.exports = app;
