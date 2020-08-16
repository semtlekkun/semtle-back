const express = require('express');
const router = express.Router();
const Recruit = require('../schemas/recruit');
const { verifyToken } = require("./middlewares/authorization");
const { findWriter } = require("./middlewares/findWriter");
const { adminConfirmation } = require('./middlewares/adminConfirmation');
const { formatDateSend } = require('../js/formatDateSend');

router.get('/list', (req, res) => {
    Recruit.find({}, { date: false, contents: false }).sort({ _id: -1 })
        .then((recruitList) => {
            res.json({ status: "success", count: recruitList.length, recruitList: recruitList });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });

});

router.get('/list/:page', (req, res) => {
    var page = req.params.page;
    Recruit.find({}).count()
        .then((count) => {
            Recruit.find({}, { date: false, contents: false }).sort({ "date": -1 }).skip((page - 1) * 10).limit(10)
                .then((recruitList) => {
                    res.json({ status: "success", count: count, recruitList: recruitList });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).send(err);
                });
        })
});

router.get('/:recruitId', (req, res) => {
    var _id = req.params.recruitId;
    Recruit.findOneAndUpdate({ _id: _id }, { $inc: { view: 1 } })
        .then((recruit) => {
            recruit.view += 1
            res.json({ status: "success", recruit: recruit });

        })
        .catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });
});

router.post('/', verifyToken, findWriter, (req, res) => {

    var writer = res.locals.writer;
    var date = formatDateSend(new Date())
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
            res.status(500).json({ status: "error" });
        }
        else {
            res.json({ status: "success" });
        }
    });
});

router.delete('/:recruitId', verifyToken, adminConfirmation, (req, res) => {
    Recruit.remove({ _id: req.params.recruitId })
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