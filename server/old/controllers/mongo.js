const mongoose = require("mongoose");

const Orders = mongoose.model("Orders");

module.exports.addOrder = function (price, type) {
    Orders.findOne({ username: "foprta" }, (err, orders) => {
        orders.addOrder(price, type);
        orders.save();
    })
}

module.exports.getOrders = function (ws) {
    Orders.findOne({ username: "foprta" }, (err, orders) => {
        ws.send(JSON.stringify({ type: "orders", data: orders.orders }));
    })
}

module.exports.updateOrder = function (id, price) {
    Orders.findOne({ username: "foprta" }, (err, orders) => {
        for (let i = 0; i < orders.orders.length; i++) {
            console.log(orders.orders[i]._id.toString(), id)
            if (orders.orders[i]._id.toString() == id) {
                console.log("JOPA")
                orders.orders[i].price = price;
                break;
            }
        }
        orders.save();
    })
}