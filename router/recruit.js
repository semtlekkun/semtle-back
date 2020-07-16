const express = require('express');
const router = express.Router();
const Recruit = require('../schemas/recruit');

router.get('/list', (req, res) => {
    Recruit.find({}, { date: false, contents: false })
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
    Recruit.findOne({ _id: _id }, { _id: false })
        .then((recruitList) => {
            res.json({ status: "SUCCESS", recruitList: recruitList });
        })
        .catch((err) => {
            console.log(err);
            res.json({ status: "FAIL" });
        });
});

router.post('/input', (req, res) => {

    var writer = req.body.writer;
    var date = req.body.date;
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
            res.json({ status: "SUCCESS" });
        }
    });

});


module.exports = router;