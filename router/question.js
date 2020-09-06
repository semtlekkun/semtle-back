const express = require('express');
const router = express.Router();
const question = require('../schemas/question');
const answer = require('../schemas/answer');
const Student = require('../schemas/student');
const { verifyToken } = require("./middlewares/authorization");
const { checkBlackList } = require("./middlewares/authorization");
const { adminConfirmation } = require('./middlewares/adminConfirmation');
const { findWriter } = require("./middlewares/findWriter");
const { formatDateSend } = require('../js/formatDateSend');
const imageUploader = require('./controllers/image.controller').imageUpload;
const imageCleaner = require('./controllers/image.controller').imageClean;

router.use('/images', express.static("images/questions"));

router.get('/list', (req, res) => {
    question.find({}, { image: false }).sort({ _id: -1 })
        .then((questionList) => {
            res.json({ status: "success", count: questionList.length, questionList: questionList });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: "error" })
        })

})

router.get('/list/:page', (req, res) => {
    var page = req.params.page
    question.find({}).count()
        .then((count) => {
            question.find({}, { image: false }).sort({ "date": -1 }).skip((page - 1) * 10).limit(10)
                .then((question) => {
                    res.json({ status: "success", count: count, question: question });
                })
                .catch(err => res.status(500).json({ status: "error" }));
        })
});

router.get('/:questionid', (req, res) => {
    question.findByIdAndUpdate({ _id: req.params.questionid }, { $inc: { view: 1 } }, { new: true })
        .then((question) => {
            if (!question) res.status(404).json({ err: 'Question not found' });
            if (question.writer != "관리자") {
                Student.findOne({ nick: question.writer }, { image: 1 })
                    .then(st => {
                        question.writerImage = st.image;
                        res.json({ status: "success", question: question });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ status: "error" });
                    })
            }
            else {
                question.writerImage = "default.jpg";
                res.json({ status: "success", question: question });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: "error" })
        });
});

router.post('/', verifyToken, checkBlackList, findWriter, imageUploader('images/questions').single("image"), (req, res) => {
    // if (res.locals.isBlack) res.status(401).json({ status: "unauthorized" })
    // else {
        req.body.writer = res.locals.writer
        req.body.image = req.file != undefined ? req.file.filename : null
        req.body.date = formatDateSend(new Date())
        req.body.view = 0
        question.create(req.body)
            .then(() => res.json({ status: "success" }))
            .catch(err => {
                console.log(err);
                res.status(500).json({ status: "error" })
            });
    // }

});

router.delete('/:questionid', verifyToken, adminConfirmation, (req, res) => {
    answer.deleteByQuestionId(req.params.questionid)
        .then(() => {
            question.deleteByQuestionId(req.params.questionid)
                .then((question) => {
                    if (question.image != "default.jpg") {
                        imageCleaner("images/questions/", question.image);
                    }
                    res.json({ status: "success" });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ status: "error" })
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: "error" });
        })
});

module.exports = router;