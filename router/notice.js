const express = require('express');
const router = express.Router();
const Notice = require('../schemas/notice');
const { verifyToken } = require("./middlewares/authorization");
const { findWriter } = require("./middlewares/findWriter");
const { adminConfirmation } = require('./middlewares/adminConfirmation');
const { formatDateSend } = require('../js/formatDateSend');
const imageUploader = require('./controllers/image.controller').imageUpload;
const fs = require('fs');

router.use(express.static('images/notices'));

router.get('/list/:page', (req, res) => {
    var page = req.params.page;
    Notice.find({}).count()
        .then((count) => {
            Notice.find({}, { contents: false, image: false }).sort({ "date": -1 }).skip((page - 1) * 10).limit(10)
                .then((noticeList) => {
                    res.status(200).json({ status: "success", noticeList: noticeList, count: count });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).send({ status: "err" });
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ status: "error" });
        })
});

router.get('/detail/:id', (req, res) => {
    Notice.findOne({ _id: req.params.id }, { _id: false })
        .then((noticeList) => {
            res.status(200).json({ status: "success", noticeList: noticeList });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ status: "err" });
        });
});

router.post('/input', verifyToken,adminConfirmation, findWriter, imageUploader("images/notices").single("img"), (req, res, next) => {

    Notice.create({
        writer: res.locals.writer,
        date: formatDateSend(new Date()),
        image: req.file != undefined? req.file.filename:null,
        title: req.body.title,
        contents: req.body.contents,
        view: 0
    }, function (err) {
        if (err) {
            console.log(err)
            res.status(500).send({ status: "error" });
        }
        else {
            res.status(200).send({ status: "success" });
        }
    });

});

router.delete('/delete', verifyToken, adminConfirmation, (req, res) => {

    Notice.findOneAndRemove({ _id: req.body._id })
        .exec(function (err, item) {
            //console.log(item.image);
            var filePath = './images/' + item.image;
            fs.unlinkSync(filePath);
            if (err) {
                res.status(500).send({ status: "err" });
            }
            if (!item) {
                return res.status(400).json({ status: "none" });
            }
            res.status(200).json({ status: "success" });
        });

});

module.exports = router;