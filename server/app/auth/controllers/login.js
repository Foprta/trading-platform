const passport = require('passport');

module.exports = function (req, res) {
    if (!req.body || !req.body.username || !req.body.password) {
        res.status(400).json({ message: "Incorrect data" });
        return;
    }

    passport.authenticate('local', function (err, user, message) {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }
        if (user) {
            res.status(200).json({ token: user.generateJWT() });
        } else {
            res.status(401).json({ message: message });
        }
    })(req, res);
}