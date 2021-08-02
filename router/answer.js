const express = require('express');
const router = express.Router();
const answer = require('../schemas/answer');
const Student = require('../schemas/student');
const { formatDateSend } = require('../js/formatDateSend');
const { verifyToken } = require("./middlewares/authorization");
const { adminConfirmation } = require('./middlewares/adminConfirmation');
const { findWriter } = require("./middlewares/findWriter");
const { checkBlackList } = require("./middlewares/authorization");

router.get('/:questionid', (req, res) => {
    function forEachPromise (items, logItem) {
        return items.reduce(function (promise, item) { //promise: acc //item: cur 
            return promise.then(function () {
                return logItem(item);
            });
        }, Promise.resolve());
    }

    function logItem (item) {
        return new Promise((resolve, reject) => {
            process.nextTick(() => {
                if (item.writer !== "ADMIN") {
                    Student.find({ nick: item.writer })
                        .then((sts) => {
                            //console.log("test:")
                            //console.log(sts[0].image);
                            item.writerImage = sts[0].image;
                            findCheck = true;
                        }).catch(err => {
                            console.log(err);
                            res.status(500).json({ status: "error" });
                        });
                }
                else {
                    item.writerImage = 'default.jpg';
                }
                //console.log(item);
                setTimeout(function () { resolve() }, 100);

            })
        });
    }
    answer.findByQuestionId(req.params.questionid)
        .then((answers) => {

            if (answers.length === 0) {
                //console.log("No answer");
                res.status(200).json({ status: "No answer" });
            } else {
                forEachPromise(answers, logItem).then(() => {
                    res.send({ answers: answers });
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: "error" });
        });
});

router.post('/', verifyToken, checkBlackList, findWriter, (req, res) => {
    req.body.writer = res.locals.writer
    req.body.date = formatDateSend(new Date())
    answer.create(req.body)
        .then(() => res.json({ status: "success" }))
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: "error" });
        });
});

router.delete('/:answerid', verifyToken, checkBlackList, adminConfirmation, (req, res) => {
    answer.deleteByAnswerId(req.params.answerid)
        .then(() => res.sendStatus(200))
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: "error" });
        });
});

module.exports = router;