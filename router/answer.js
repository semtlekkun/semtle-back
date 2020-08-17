const express = require('express');
const router = express.Router();
const answer = require('../schemas/answer');
const Student = require('../schemas/student');
const { formatDateSend } = require('../js/formatDateSend');
const { verifyToken } = require("./middlewares/authorization");
const { adminConfirmation } = require('./middlewares/adminConfirmation');
const { findWriter } = require("./middlewares/findWriter");

router.get('/:questionid', (req, res) => {
    answer.findByQuestionId(req.params.questionid)
        .then((answers) => {
            answers.forEach(async (element, index) => {
                if (element.writer !== "관리자") {
                    await Student.find({ nick: element.writer })
                        .then((sts) => {
                            element.writerImage = !sts.length? "default.jpg":sts[0].image;
                        }).catch(err => {
                            console.log(err);
                            res.status(500).json({ status: "error" });
                        });
                }
                else {
                    element.writerImage = 'default.jpg';
                }
                if (index === answers.length - 1) {
                    res.send({ answers: answers });
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: "error" });
        });
});

router.post('/', verifyToken, findWriter, (req, res) => {
    req.body.writer = res.locals.writer
    req.body.date = formatDateSend(new Date())
    answer.create(req.body)
        .then(() => res.json({ status: "success" }))
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: "error" });
        });
});

router.delete('/:answerid', verifyToken, adminConfirmation, (req, res) => {
    answer.deleteByAnswerId(req.params.answerid)
        .then(() => res.sendStatus(200))
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: "error" });
        });
});

module.exports = router;