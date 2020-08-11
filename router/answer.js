const express = require('express');
const router = express.Router();
const answer = require('../schemas/answer');

router.get('/:questionid', (req, res) => {
    answer.findByQuestionId(req.params.questionid)
        .then((answer) => {
            if (!answer.length) return res.status(404).send({ err: 'Answer not found' });
            res.send(answer);
        })
        .catch(err => res.status(500).send(err));
});

router.post('/:questionid', (req, res) => {
    answer.create(req.body)
        .then(answer => res.send(answer))
        .catch(err => res.status(500).send(err));
});

router.put('/:answerid', (req, res) => {
    answer.updateByQuestionId(req.params.answerid, req.body)
        .then(answer => res.send(answer))
        .catch(err => res.status(500).send(err));
});

router.delete('/:answerid', (req, res) => {
    answer.deleteByAnswerId(req.params.answerid)
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).send(err));
});


module.exports = router;