const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Products = new Schema({
    product_title: {
        type: String
    },
    product_description: {
        type: String
    },
    product_price: {
        type: Number
    },
    product_quantity: {
        type: Number
    },
    img: {
        type: String
    }
});

module.exports = mongoose.model('Products', Products)