const express = require('express');
const router = express.Router();
const Notice = require('../schemas/notice');
const multer = require('multer');
const format = require('../js/formatDate');
const { verifyToken } = require("./middlewares/authorization");
const { findWriter } = require("./middlewares/findWriter");
const { adminConfirmation } = require('./middlewares/adminConfirmation');
const {formatDateSend} = require('../js/formatDateSend');

router.get('/list/:page', (req, res) => {
    var page = req.params.page;
    Notice.find({}, { contents: false, image: false }).sort({ "date": -1 }).skip((page - 1) * 10).limit(10)
        .then((noticeList) => {
            res.status(200).json({ status: "success", noticeList: noticeList });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });
});


router.get('/detail/:id', (req, res) => {
    Notice.findOne({ _id: req.params.id }, { _id: false })
        .then((noticeList) => {
            res.status(200).json({ status: "success", noticeList: noticeList });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });
});


var imageStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./Images");
    },
    filename: function (req, file, callback) {
        //파일명 설정
        callback(null, format(new Date()) + '_' + file.originalname);
    }
});

var upload = multer({
    storage: imageStorage
});


router.post('/input', verifyToken, findWriter, upload.single("img"), (req, res, next) => {

    var writer = res.locals.writer;
    var title = req.body.title;
    var contents = req.body.contents;
    var image;
    if (req.file != undefined)
        image = req.file.filename
    else image = null;
    var date = formatDateSend(new Date())

    Notice.create({
        writer: writer,
        date: date,
        image: image,
        title: title,
        contents: contents,
        view: 0
    }, function (err) {
        if (err) {
            console.log(err)
            res.status(500).send(err);
        }
        else {
            res.status(200).send({ status: "success" });
        }
    });

});

// router.put('/update', verifyToken, adminConfirmation, (req, res) => {
//     req.body.date = new Date()
//     Notice.update({ _id: req.body._id },
//         { $set: req.body })
//         .then((result) => {
//             console.log(result);
//             if (result.n) res.status(200).json({ status: "success" });
//             else res.status(400).json({ status: "noMatched" });
//         })
//         .catch((err) => {
//             console.log(err);
//             res.status(500).json({ status: "error" });
//         })
// });

router.delete('/delete', verifyToken, adminConfirmation, (req, res) => {
    Notice.remove({ _id: req.body._id })
        .then((result) => {
            if (result.deletedCount) res.status(200).json({ status: "success" });
            else res.status(400).json({ status: "none" });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ status: "error" });
        })
});

module.exports = router;