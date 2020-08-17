const express = require('express');
const router = express.Router();
const answer = require('../schemas/answer');
const mongoose = require('mongoose');
const {formatDateSend} = require('../js/formatDateSend');
const {verifyToken} = require("./middlewares/authorization");
const {adminConfirmation} =  require('./middlewares/adminConfirmation');
const {findWriter} = require("./middlewares/findWriter"); 

router.get('/:questionid', (req, res) => {
    // answer.findByQuestionId(req.params.questionid)
    //     .then((answers) => {
            answer.aggregate([
                { $match: { question: mongoose.Types.ObjectId(req.params.questionid) } },
                {
                    $lookup:{
                        from:"student",
                        let:{writer:"$writer"},
                        pipeline:[
                            {
                                $match:
                                {
                                    $expr:
                                    {
                                        $and:[{$eq:["$$writer","$nick"]}]
                                    }
                                }
                            },
                            {$project:{_id:0,image:1}}
                        ],
                        as:"writerImage"
                    }
                }
            ])
            .then(answers=>{
                res.json({answers:answers});
            })
            .catch(err => {
                    console.log(err);
                    res.status(500).send(err)});
        // })
        // .catch(err => {
        //     console.log(err);
        //     res.status(500).send(err)});
});

router.post('/',verifyToken,findWriter, (req, res) => {
    req.body.writer = res.locals.writer
    req.body.date = formatDateSend(new Date())
    answer.create(req.body)
        .then(() => res.json({status:"success"}))
        .catch(err => {
            console.log(err);
            res.status(500).send(err)});
});

router.delete('/:answerid',verifyToken,adminConfirmation, (req, res) => {
    answer.deleteByAnswerId(req.params.answerid)
        .then(() => res.sendStatus(200))
        .catch(err => {
            console.log(err);
            res.status(500).send(err)});
});

module.exports = router;