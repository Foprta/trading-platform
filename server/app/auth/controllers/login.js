const passport = require('passport');
const Response = require('../models/Response');

module.exports = function (req, res) {
    if (!req.body || !req.body.username || !req.body.password) {
        res.status(400).json(Response("Incorrect data", "error"));
        return;
    }

    passport.authenticate('local', function (err, user, message) {
        if (err) {
            res.status(500).json(Response(err, "error"));
            return;
        }
        if (user) {
            res.status(200).json(Response(user.generateJWT(), "ok"));
        } else {
            res.status(401).json(Response(message, "error"));
        }
    })(req, res);
}