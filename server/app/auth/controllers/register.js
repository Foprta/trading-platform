const User = require('../models/User')

module.exports = function(req, res) {
    User.exists({username: req.body.username}, function(err, exists) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        if (exists) {
            res.status(403).send("User already exists")
            return;
        }
    })

    let user = new User({username: req.body.username});
    user.setPassword(req.body.password);
    user.save(function(err, savedUser) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).send(savedUser);
    })
}