const express = require('express');
const router = express.Router();
const question = require('../schemas/question');
const answer = require('../schemas/answer');
const { verifyToken } = require("./middlewares/authorization");
const { adminConfirmation } = require('./middlewares/adminConfirmation');
const { findWriter } = require("./middlewares/findWriter");
const { formatDateSend } = require('../js/formatDateSend');
const imageUploader = require('./controllers/image.controller').imageUpload;
const imageCleaner = require('./controllers/image.controller').imageClean;

router.use(express.static("images/questions"));

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
    question.findOneByQuestionId(req.params.questionid)
        .then((question) => {
            if (!question) res.status(404).json({ err: 'Question not found' });
            question.view += 1
            res.send(question);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: "error" })
        }
        );
});

router.post('/', verifyToken, findWriter, imageUploader('images/questions').single("image"), (req, res) => {
    req.body.writer = res.locals.writer
    req.body.image = req.file != undefined ? req.file.filename : null
    req.body.date = formatDateSend(new Date())
    question.create(req.body)
        .then(() => res.json({ status: "success" }))
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: "error" })
        });
});

router.delete('/:questionid', verifyToken, adminConfirmation, (req, res) => {
    answer.deleteByQuestionId(req.params.questionid)
        .then(() => {
            question.deleteByQuestionId(req.params.questionid)
                .then((question) => {
                    imageCleaner("images/questions/",question.image);
                    res.json({ status: "success" });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({status:"error"})});
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({status:"error"});
        })
});

module.exports = router;