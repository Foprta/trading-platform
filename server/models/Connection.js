const User = require('../app/auth/models/User');

module.exports = async function (userId) {
    const user = await User.findById(userId, (err, user) => {
        if (err) return;

        return user;
    });

    return require("node-binance-api")().options({
        APIKEY: user.getBinanceApi(),
        APISECRET: user.getBinanceSecret(),
        reconnect: false,
        recvWindow: 60000,
        useServerTime: true // If you get timestamp errors, synchronize to server time at startup
    });
}