const express = require('express');
const router = express.Router();
const question = require('../schemas/question');

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

router.post('/', (req, res) => {
    question.create(req.body)
        .then(question => res.send(question))
        .catch(err => res.status(500).send(err));
});

router.put('/:questionid', (req, res) => {
    question.updateByQuestionId(req.params.questionid, req.body)
        .then(question => res.send(question))
        .catch(err => res.status(500).send(err));
});

router.delete('/:questionid', (req, res) => {
    question.deleteByQuestionId(req.params.questionid)
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).send(err));
});

module.exports = router;