const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './public/images/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


module.exports = multer({
    storage: storage,
    limits: { fileSize: 1000000 }
});

