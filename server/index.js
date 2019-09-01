const express = require("express");
const path = require("path");
const config = require("./configs/config.json");
const wss = require("./routes/websocket");
const mongo = require("./routes/mongo");
const passport = require("passport");
const bodyParser = require('body-parser');
require('./auth/models/User');
require('./auth/configs/passport');

const app = express();

const distDir="../dist/trading-platform"
const authRoute = require('./auth/routes/index')

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
