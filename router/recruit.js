const express = require('express');
const router = express.Router();
const Recruit = require('../schemas/recruit');
const Student = require('../schemas/student');

router.get('/list/:page', (req, res) => {
    var page = req.params.page;
    Recruit.find({}, { date: false, contents: false }).sort({ "date": -1 }).skip((page - 1) * 10).limit(10)
        .then((recruitList) => {
            res.json({ status: "success", recruitList: recruitList });

        })
        .catch((err) => {
            console.log(err);
            res.json({ status: "fail" });
        });
});

router.get('/detail/:id', (req, res) => {
    var _id = req.params.id;

    Recruit.findOne({ _id: _id })
        .then((recruitList) => {
            res.json({ status: "success", recruitList: recruitList });
        })
        .catch((err) => {
            console.log(err);
            res.json({ status: "fail" });
        });
});

router.post('/input', (req, res) => {

    var writer = req.body.writer;
    var date = new Date();
    var now = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + 9, date.getMinutes(), date.getSeconds());
    var endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + req.body.endDate);
    var recruitment = req.body.recruitment;
    var title = req.body.title;
    var contents = req.body.contents;

    Recruit.create({
        writer: writer, date: now, endDate: endDate,
        recruitment: recruitment, title: title,
        contents: contents, view: 0
    }, function (err) {
        if (err) {
            return handleError(err);
        }
        else {
            res.json({ status: "success" });
        }
    });
});


module.exports = router;