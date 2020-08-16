const express = require('express');
const router = express.Router();
const answer = require('../schemas/answer');
const {formatDateSend} = require('../js/formatDateSend');
const {verifyToken} = require("./middlewares/authorization");
const {adminConfirmation} =  require('./middlewares/adminConfirmation');
const {findWriter} = require("./middlewares/findWriter"); 


router.get('/:questionid', (req, res) => {
    answer.findByQuestionId(req.params.questionid)
        .then((answer) => {
            res.send({answer:answer});
        })
        .catch(err => {res.status(500).send(err)});
});

router.post('/:questionid',verifyToken,findWriter, (req, res) => {
    req.body.writer = res.locals.writer
    req.body.date = formatDateSend(new Date())
    answer.create(req.body)
        .then(answer => res.send(answer))
        .catch(err => res.status(500).send(err));
});

router.delete('/:answerid',verifyToken,adminConfirmation, (req, res) => {
    answer.deleteByAnswerId(req.params.answerid)
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).send(err));
});


module.exports = router;