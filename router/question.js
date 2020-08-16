const express = require('express');
const router = express.Router();
const question = require('../schemas/question');
const answer = require('../schemas/answer');
const multer = require("multer");
const format = require('../js/formatDate');
const {verifyToken} = require("./middlewares/authorization");
const {adminConfirmation} =  require('./middlewares/adminConfirmation');
const {findWriter} = require("./middlewares/findWriter"); 
const {formatDateSend} = require('../js/formatDateSend');
const imageUploader = require('./controllers/image.controller').imageUpload;

router.use(express.static("images/questions"));

router.get('/list/:page', (req, res) => {
    var page = req.params.page
    question.find({}).count()
    .then((count)=>{
        question.find({},{image: false }).sort({ "date": -1 }).skip((page - 1) * 10).limit(10)
        .then((question) => {
            res.send({status:"success",question:question,count:count});
        })
        .catch(err => res.status(500).send(err));
    })
});

router.get('/:questionid', (req, res) => {
    question.findOneByQuestionId(req.params.questionid)
        .then((question) => {
            if (!question) return res.status(404).send({ err: 'Question not found' });
            res.send(question);
        })
        .catch(err => res.status(500).send(err));
});

router.post('/',verifyToken,findWriter,imageUploader('images/questions').single("image"), (req, res) => {
    req.body.writer = res.locals.writer
    req.body.image = req.file.filename != undefined? req.file.filename:null
    req.body.date = formatDateSend(new Date())
    question.create(req.body)
        .then(() => res.json({status:"success"}))
        .catch(err => res.status(500).send(err));
});


// router.put('/:questionid',verifyToken,adminConfirmation,findWriter,upload.single("image"), (req, res) => {
//     req.body.writer = res.locals.writer
//     req.body.image = req.file.filename != undefined? req.file.filename:null
//     req.body.date = new Date()
//     question.updateByQuestionId(req.params.questionid, req.body)
//         .then(question => res.send(question))
//         .catch(err => res.status(500).send(err));
// });

router.delete('/:questionid',verifyToken,adminConfirmation, (req, res) => {

    answer.deleteByQuestionId(req.params.questionid)
    .then(()=>{
        question.deleteByQuestionId(req.params.questionid)
        .then(() => res.json({status:"success"}))
        .catch(err => res.status(500).send(err));
    })


});

module.exports = router;