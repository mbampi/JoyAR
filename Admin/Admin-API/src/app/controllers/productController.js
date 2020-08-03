const express = require('express');
const authMiddleware = require('../middleware/auth');
const multer = require('../middleware/multer');
const sharp = require('sharp');
const fs = require('fs');

const Product = require('../models/Product');
const Image = require('../models/Image');

const router = express.Router();

router.use(authMiddleware);


router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate(['user', 'image']);

        res.send({ products });
    } catch (err) {
        return res.status(400).send({ error: "Error listing all products" });
    }
});

router.get('/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId).populate('user');

        res.send({ product });
    } catch (err) {
        return res.status(400).send({ error: "Error showing product" });
    }
});

router.post('/', multer.single('productImage'), async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).send({ error: "Image upload failed" });

        const imgData = fs.readFileSync(req.file.path);
        const optimizedImage = await sharp(imgData)
            .resize(480, 480, { fit: 'inside', withoutEnlargement: true })
            .toBuffer();

        const image = new Image;
        image.img.data = optimizedImage;
        image.img.contentType = req.file.mimetype;
        image.save();

        const productData = JSON.parse(req.body.data);
        const product = await Product.create({ ...productData, user: req.userId, image: image._id });

        return res.send({ product });

    } catch (err) {
        return res.status(400).send({ error: 'Error creating new product' });
    }
});

router.put('/:productId', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });
        res.send({ product });
    } catch (err) {
        return res.status(400).send({ error: "Error uploading product" });
    }
});

router.delete('/:productId', async (req, res) => {
    try {
        await Product.findByIdAndRemove(req.params.productId);
        res.send();
    } catch (err) {
        return res.status(400).send({ error: "Error deleting product" });
    }
});


module.exports = app => app.use('/products', router);
