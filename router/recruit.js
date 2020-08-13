const express = require('express');
const router = express.Router();
const Recruit = require('../schemas/recruit');
const Student = require('../schemas/student');

router.get('/list/:page', (req, res) => {
    var page = req.params.page;
    Recruit.find({}, { date: false, contents: false }).sort({ "date": -1 }).skip((page - 1) * 10).limit(10)
        .then((recruitList) => {

            res.status(200).json({ status: "success", recruitList: recruitList });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });
});

router.get('/detail/:id', (req, res) => {
    var _id = req.params.id;

    Recruit.findOne({ _id: _id })
        .then((recruitList) => {
            res.status(200).json({ status: "success", recruitList: recruitList });

        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });
});

router.post('/input', (req, res) => {

    var writer = req.body.writer;
    var date = new Date();
    var endDate = req.body.endDate;
    var recruitment = req.body.recruitment;
    var title = req.body.title;
    var contents = req.body.contents;

    Recruit.create({
        writer: writer, date: date, endDate: endDate,
        recruitment: recruitment, title: title,
        contents: contents, view: 0
    }, function (err) {
        if (err) {
            return handleError(err);
        }
        else {
            res.status(200).send({ status: "success" });
        }
    });
});


module.exports = router;