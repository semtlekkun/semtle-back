const express = require('express');
const router = express.Router();
const question = require('../schemas/question');

const {verifyToken} = require("./middlewares/authorization");
const {adminConfirmation} =  require('./middlewares/adminConfirmation');
const {findWriter} = require("./middlewares/findWriter"); 


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

router.post('/',verifyToken,findWriter, (req, res) => {
    req.body.writer = res.locals.writer
    question.create(req.body)
        .then(question => res.send(question))
        .catch(err => res.status(500).send(err));
});

router.put('/:questionid',verifyToken,adminConfirmation, (req, res) => {
    question.updateByQuestionId(req.params.questionid, req.body)
        .then(question => res.send(question))
        .catch(err => res.status(500).send(err));
});

router.delete('/:questionid',verifyToken,adminConfirmation, (req, res) => {
    question.deleteByQuestionId(req.params.questionid)
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).send(err));
});

module.exports = router;