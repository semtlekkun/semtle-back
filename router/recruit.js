const express = require('express');
const router = express.Router();
const Recruit = require('../schemas/recruit');
const Student = require('../schemas/student');
const { verifyToken } = require("./middlewares/authorization");
const { findWriter } = require("./middlewares/findWriter");
const { adminConfirmation } = require('./middlewares/adminConfirmation');
const { formatDateSend } = require('../js/formatDateSend');

router.get('/list/:page', (req, res) => {
    var page = req.params.page;
    Recruit.find({}).count()
        .then((count) => {
            Recruit.find({}, { date: false, contents: false }).sort({ "date": -1 }).skip((page - 1) * 10).limit(10)
                .then((recruitList) => {
                    res.status(200).json({ status: "success", recruitList: recruitList, count: count });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).send(err);
                });
        })
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

router.post('/input', verifyToken, findWriter, (req, res) => {

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
            return handleError(err);
        }
        else {
            res.status(200).send({ status: "success" });
        }
    });
});

router.delete('/delete', verifyToken, adminConfirmation, (req, res) => {
    Recruit.remove({ _id: req.body._id })
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