const User = require('../models/User')

module.exports = function (req, res) {
    if (!req.body || !req.body.username || !req.body.password) {
        res.status(400).send("No data recieved");
        return;
    }

    let query = { username: req.body.username };
    User.findOne(query, function(err, user) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        if (!user.verifyPassword(req.body.password.toString())) {
            res.status(403).send("User not found");
            return;
        }

        res.status(200).send({"token" : user.generateJWT()});
    })
}