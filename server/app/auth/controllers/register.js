const User = require('../models/User')
const Response = require('../models/Response');

module.exports = function (req, res) {
    User.exists({ username: req.body.username })
        .then(exists => {
            if (!exists) {
                let user = new User({ username: req.body.username });
                user.setPassword(req.body.password);
                user.save()
                    .then(savedUser => {
                        res.status(200).json(Response("User created", "ok"))
                    })
                    .catch(err => {
                        res.status(500).json(Response(err, "error"));
                    })
            } else {
                res.status(400).json(Response("User aleady exists", "error"))
            }
        })
        .catch(err => {
            res.status(500).json(Response(err, "error"));
        })
}