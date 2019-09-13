const User = require('../models/User')

module.exports = function (req, res) {
    User.exists({ username: req.body.username })
        .then(exists => {
            if (!exists) {
                let user = new User({ username: req.body.username });
                user.setPassword(req.body.password);
                user.save()
                    .then(savedUser => {
                        res.status(200).json({message: "User created"})
                    })
                    .catch(err => {
                        res.status(500).json({error: err});
                    })
            } else {
                res.status(400).json({message: "User already exist"})
            }
        })
        .catch(err => {
            res.status(500).json({error: err});
        })
}