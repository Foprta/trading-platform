const mongoose = require("mongoose")
const Schema = mongoose.Schema

let orderSchema = new Schema({
    id: Schema.ObjectId,
    price: Number,
    type: String
});

let ordersSchema = new Schema({
    username: String,
    pair: String,
    orders: [orderSchema]
});

const Order = mongoose.model('Order', orderSchema, "orders");

// Генерация хэша пароля с солью
ordersSchema.methods.addOrder = function (price, type) {
    let order = new Order({
        price: price,
        type: type
    })
    this.orders.push(order);
}

mongoose.model('Orders', ordersSchema, "orders");