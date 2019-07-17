const express = require("express");
const path = require("path");
const config = require("./configs/config.json");
const wss = require("./routes/websocket");

const app = express();

const distDir="../dist/trading-platform"

app.use(express.static(path.join(__dirname, distDir)))

app.all('*', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, distDir)+"/index.html");
});

app.listen(config.port, () => {
  console.info(`server started on port ${config.port}`);
});

module.exports = app;
