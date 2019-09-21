const mongoose = require("mongoose")
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

let userSchema = new mongoose.Schema({
    username: String,
    password: String,
    salt: String,
    BinanceApi: String,
    BinanceSecret: String,
});

// Генерация хэша пароля с солью
userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
}

// Проверка пароля
userSchema.methods.verifyPassword = function(password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.password === hash;
}

// Шифрование API Binance
userSchema.methods.setBinanceApi = function(api) {
    this.BinanceApi = api;
}

// Шифрование Secret Binance
userSchema.methods.setBinanceSecret = function(secret) {
    this.BinanceSecret = secret;
}

// Получение API Binance
userSchema.methods.getBinanceApi = function() {
    return this.BinanceApi;
}

// Получение Secret Binance
userSchema.methods.getBinanceSecret = function() {
    return this.BinanceSecret;
}

// Генерация куки авторизации
userSchema.methods.generateJWT = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
  
    return jwt.sign({
      _id: this._id,
      username: this.username,
      exp: parseInt(expiry.getTime() / 1000),
    }, "mine_jwt_secret");
}

module.exports = mongoose.model('User', userSchema, "users");