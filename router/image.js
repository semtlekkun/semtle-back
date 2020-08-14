const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();
//const imageController = require('../controllers/image');

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, new Date().valueOf() + path.extname(file.originalname));
        },
    }),
});

router.post('/', upload.single('img'), imageController);

module.exports = router;