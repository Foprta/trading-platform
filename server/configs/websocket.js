const WebSocket = require('ws');
const config = require('../configs/config');

const wss = new WebSocket.Server({ port: config.wsPort, clientTracking: true });

module.exports = wss;

