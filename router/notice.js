const express = require('express');
const router = express.Router();
const Notice = require('../schemas/notice');

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
            res.json({ status: "SUCCESS", noticeList: noticeList });
        })
        .catch((err) => {
            console.log(err);
            res.json({ status: "FAIL" });
        });
});


router.post('/input', (req, res) => {

    var writer = req.body.writer;
    var date = req.body.date;
    //var image = req.body.image;
    var title = req.body.title;
    var contents = req.body.contents;

    Notice.create({
        writer: writer, date: date,
        image: image, title: title,
        contents: contents
    }, function (err) {
        if (err) {
            return handleError(err);
        }
        else {
            res.json({ status: "SUCCESS" });
        }
    });

});

module.exports = router;