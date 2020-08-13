const express = require('express');
const router = express.Router();
const question = require('../schemas/question');
const multer = require("multer");
const format = require('../js/formatDate');
const {verifyToken} = require("./middlewares/authorization");
const {adminConfirmation} =  require('./middlewares/adminConfirmation');
const {findWriter} = require("./middlewares/findWriter"); 
const {formatDateSend} = require('../js/formatDateSend');
router.use(express.static("images"));

var imageStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./images");
    },
    filename: function (req, file, callback) {
        callback(null, format(new Date()) + '_' + file.originalname);
    }
})

var upload = multer({
    storage: imageStorage
});

router.get('/', (req, res) => {
    question.findAll()
        .then((question) => {
            if (!question.length) return res.status(404).send({ err: 'Question not found' });
            res.send(question);
        })
        .catch(err => res.status(500).send(err));
});

router.get('/:questionid', (req, res) => {
    question.findOneByQuestionId(req.params.questionid)
        .then((question) => {
            if (!question) return res.status(404).send({ err: 'Question not found' });
            res.send(question);
        })
        .catch(err => res.status(500).send(err));
});

router.post('/',verifyToken,findWriter,upload.single("image"), (req, res) => {
    req.body.writer = res.locals.writer
    console.log(req.file.filename)
    req.body.image = req.file.filename != undefined? req.file.filename:null
    req.body.date = formatDateSend(new Date())
    question.create(req.body)
        .then(question => res.send(question))
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
    question.deleteByQuestionId(req.params.questionid)
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).send(err));
});
//question 테스트 완료

module.exports = router;