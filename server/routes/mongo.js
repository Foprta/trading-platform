const mongo = require("../controllers/mongo")

module.exports.getOrders = function(ws) {
    mongo.getOrders(ws);
}

module.exports.updateOrder = function(data) {
    console.log(data);
    mongo.updateOrder(data.id, data.price);
}