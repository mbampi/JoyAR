
const mongoose = require('./../../database');


const ImageSchema = new mongoose.Schema({
    img: {
        data: Buffer,
        contentType: String,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;
