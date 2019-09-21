const io = require('socket.io').listen(8080);
const BinanceConnection = require('../../../models/Connection')
const socketioJwt = require('socketio-jwt')
const binanceCtrl = require('../../../binance/controllers/streams');

const secured = io.of('/secured');

secured.use(socketioJwt.authorize({
    secret: 'mine_jwt_secret',
    handshake: true,
    decodedPropertyName: 'decoded_token'
}));

secured.on('connection', async function (socket) {
    socket.binance = await BinanceConnection(socket.decoded_token._id);
    socket.on('sub', ({ type, options }) => {
        binanceCtrl[type](socket, options);
        socket.on('unsub', (subscription) => {
            binanceCtrl.unsubscribe(socket, subscription)
        });
    });
    socket.on('disconnect', () => {
        binanceCtrl.unsubscribeAll(socket.binance)
    });
})

io.on('connection', (socket) => {
    console.log(socket.client.id, "connected")
    socket.on('disconnect', () => {
        console.log(socket.client.id, 'disconnected')
    })
})