const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const JWTExtractor = passportJWT.ExtractJwt;
const User = require('../models/User');

passport.use(new LocalStrategy({
    usernameField: 'username'
},
    function (username, password, done) {
        return User.findOne({ username: username })
            .then(user => {
                if (!user)
                    return done(null, null, "User not found")
                if (!user.verifyPassword(password)) {
                    return done(null, null, "Password incorrect")
                }
                return done(null, user);
            })
            .catch(err => {
                return done(err);
            })
    }));

passport.use(new JWTStrategy({
    jwtFromRequest: JWTExtractor.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'mine_jwt_secret'
},
    function (jwtPayload, done) {
        return User.findById(jwtPayload._id)
            .then(user => {
                return done(null, user);
            })
            .catch(err => {
                return done(err);
            });
    }
));

module.exports = passport;