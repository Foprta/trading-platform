const express = require('express');
const path = require("path");
const appRoutes = require('./app/routes/routes')
const bodyParser = require('body-parser');

// Подключение всех штуковин
require('./mongoose/index') // Подключение к БД
//

const app = express();

const distDir="../dist/trading-platform"

app.use(express.static(path.join(__dirname, distDir)))

app.use(bodyParser.json());

app.use('/app', appRoutes)

app.all('*', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, distDir) + "/index.html");
});

module.exports = app;