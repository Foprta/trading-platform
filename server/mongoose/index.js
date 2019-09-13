const mongoose = require("mongoose");
const CONFIG = require('./configs/mongodb');

mongoose.connect(`${CONFIG.BASE_URL}:${CONFIG.PORT}/${CONFIG.DB_NAME}`, { useNewUrlParser: true })