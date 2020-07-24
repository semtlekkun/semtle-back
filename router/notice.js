const express = require('express');
const router = express.Router();
const Notice = require('../schemas/notice');
const multer = require('multer');


router.get('/list', (req, res) => {
    Notice.find({}, { contents: false, image: false })
        .then((noticeList) => {
            res.json({ status: "success", noticeList: noticeList });
        })
        .catch((err) => {
            console.log(err);
            res.json({ status: "fail" });
        });
});


router.get('/detail/:id', (req, res) => {

    var _id = req.params.id;
    Notice.findOne({ _id: _id }, { _id: false })
        .then((noticeList) => {
            res.json({ status: "success", noticeList: noticeList });
        })
        .catch((err) => {
            console.log(err);
            res.json({ status: "fail" });
        });
});


var imageStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./Images");
    },
    filename: function (req, file, callback) {
        //파일명 설정
        var fileDate = req.body.date;
        var fileName = file.originalname;
        //console.log("multer1 " + file);
        //console.log("multer2 " + fileDate);
        callback(null, fileDate + '_' + fileName);
        //callback(null, new Date().valueOf() + '_' + fileName);

    }
});

var upload = multer({
    storage: imageStorage
});


router.post('/input', upload.single("img"), (req, res, next) => {

    var writer = req.body.writer;
    var date = req.body.date;
    var title = req.body.title;
    var contents = req.body.contents;
    var file = req.file;
    //var fileDate = req.body.fileName;
    var image;

    if (file != undefined)
        image = date + '_' + file.originalname;
    else image = null;
    // console.log(file.originalname);
    console.log(image);

    Notice.create({
        writer: writer,
        date: date,
        image: image,
        title: title,
        contents: contents,
        view: 0
    }, function (err) {
        if (err) {
            res.json({ status: "fail" });
            return handleError(err);
        }
        else {
            res.json({ status: "success" });
        }
    });

});

module.exports = router;