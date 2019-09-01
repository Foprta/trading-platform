const mongoose = require("mongoose")
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

let userSchema = new mongoose.Schema({
    username: String,
    password: String,
    salt: String
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

// Генерация куки авторизации
userSchema.methods.generateJWT = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
  
    return jwt.sign({
      _id: this._id,
      username: this.username,
      exp: parseInt(expiry.getTime() / 1000),
    }, "MY_SECRET");
}

mongoose.model('User', userSchema, "users");