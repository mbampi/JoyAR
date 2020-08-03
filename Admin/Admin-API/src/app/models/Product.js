
const mongoose = require('./../../database');


const ProductSchema = new mongoose.Schema({
    name: { type: String, require: true, },

    type: { type: String, require: true, },

    price: { type: Number, require: false, },

    url: { type: String, require: false, },

    description: { type: String, require: false, },

    image: { type: mongoose.Schema.Types.ObjectId, ref: 'Image', require: true, },

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true, },

    createdAt: { type: Date, default: Date.now, },

    // Size and Offsets not included. Images may follow a pattern with pre-defined size and offset
});


const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
