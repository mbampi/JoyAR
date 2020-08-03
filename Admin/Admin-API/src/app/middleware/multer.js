
const multer = require('multer');

const sizeLimit = 5 * 1024 * 1024; // 5MB


storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/temp/images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now().toString() + '-' + file.originalname);
    },
});

module.exports = (multer({
    dest: 'src/temp/images', storage,
    fileFilter: (req, file, cb) => {
        const isAccepted = ['image/png'].find(acceptedFormat => acceptedFormat == file.mimetype);
        if (!isAccepted)
            return cb(null, false);
        return cb(null, true);
    },
    limits: { fileSize: sizeLimit }
}));