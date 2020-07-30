const express = require('express');
const router = express.Router();
const Question = require('../schemas/question');

router.get('/list', (req, res) => {
    Question.find({}, { _id: true, title: true, contents: true, writer: true, date: true })
        .then((QnAList) => {
            res.json({ status: "success", QnAList: QnAList });
        })
        .catch((err) => {
            console.log(err);
            res.json({ status: "fail" });
        });
});

module.exports = router;