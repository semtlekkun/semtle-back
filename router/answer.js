const express = require('express');
const router = express.Router();
const answer = require('../schemas/answer');

const {verifyToken} = require("./middlewares/authorization");
const {adminConfirmation} =  require('./middlewares/adminConfirmation');
const {findWriter} = require("./middlewares/findWriter"); 


router.get('/:questionid', (req, res) => {
    answer.findByQuestionId(req.params.questionid)
        .then((answer) => {
            if (!answer.length){
                console.log(answer);
                return res.status(404).send({ err: 'Answer not found' });
            } 
            res.send(answer);
        })
        .catch(err => {res.status(500).send(err)});
});

router.post('/:questionid',verifyToken,findWriter, (req, res) => {
    req.body.writer = res.locals.writer
    req.body.date = new Date()
    answer.create(req.body)
        .then(answer => res.send(answer))
        .catch(err => res.status(500).send(err));
});

router.put('/:answerid',verifyToken,adminConfirmation, (req, res) => {
    req.body.date = new Date()
    answer.updateByQuestionId(req.params.answerid, req.body)
        .then(answer => res.send(answer))
        .catch(err => res.status(500).send(err));
});

router.delete('/:answerid',verifyToken,adminConfirmation, (req, res) => {
    answer.deleteByAnswerId(req.params.answerid)
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).send(err));
});


module.exports = router;