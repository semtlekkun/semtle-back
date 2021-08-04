const express = require('express');
const router = express.Router();
const Photo = require('../schemas/photo');
const { verifyToken } = require("./middlewares/authorization");
const { findWriter } = require("./middlewares/findWriter");
const { adminConfirmation } = require('./middlewares/adminConfirmation');
const { formatDateSend } = require('../js/formatDateSend');
const { checkBlackList } = require("./middlewares/authorization");
const imageUploader = require('./controllers/image.controller').imageUpload;
const imageCleaner = require('./controllers/image.controller').imageClean;
router.use('/images', express.static('images/photos'));

router.get('/list', (req, res) => {
    Photo.find().sort({ _id: -1 })
        .then((photoList) => {
            res.json({ status: "success", count: photoList.length, photoList: photoList });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });
});

router.get('/:photoId', (req, res) => {
    var _id = req.params.photoId;
    Photo.findOneAndUpdate({ _id: _id }, { $inc: { view: 1 } })
        .then((photo) => {
            photo.view += 1
            res.json({ status: "success", photo: photo });

        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });
});

router.post('/', verifyToken, checkBlackList, adminConfirmation, findWriter, imageUploader("images/photos").single("image"), (req, res, next) => {
    Photo.create({
        writer: res.locals.writer,
        date: formatDateSend(new Date()),
        image: req.file != undefined ? req.file.filename : null,
        title: req.body.title,
        contents: req.body.contents,
        view: 0
    }, function (err) {
        if (err) {
            console.log(err)
            res.status(500).json({ status: "error" });
        }
        else {
            res.json({ status: "success" });
        }
    });
});

router.delete('/:photoId', verifyToken, checkBlackList, adminConfirmation, (req, res) => {
    Photo.remove({ _id: req.params.photoId })
        .then((result) => {
            if (result.deletedCount) res.json({ status: "success" });
            else res.status(400).json({ status: "none" });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ status: "error" });
        })
});

module.exports = router;