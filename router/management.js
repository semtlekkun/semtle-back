const express = require('express');
const router = express.Router();
const Management = require('../schemas/management');
const studentCheck = require('./controllers/user.controller').checkStudent;
const {verifyToken} = require("./middlewares/authorization");
const {adminConfirmation} =  require('./middlewares/adminConfirmation');

router.get('/list',(req,res)=>{
    Management.aggregate([
        {
            $lookup:{
                from:"student",
                let:{studentCode:"$studentCode"},
                pipeline:[
                    {
                        $match:
                        {
                            $expr:
                            {
                                $and:
                                [{$eq:["$$studentCode","$_id"]}]
                            }
                        },
                    },
                    {$project:{_id:0,pw:0,phoneNum:0,nick:0}}
                ],
                as:"Info"
            }
        }
    ])
    .then((management)=>{
        res.status(200).json({status:"success",management:management});
    })
});

router.post('/input',verifyToken,adminConfirmation,studentCheck,(req,res)=>{
    const management = new Management(req.body);
    management.save()
    .then(()=>{
        res.status(200).json({status:"success"});
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({status:"error"});
    });
})

router.delete('/delete',verifyToken,adminConfirmation,(req,res)=>{
    Management.remove({_id:req.body._id})
    .then((result)=>{
        if(result.deletedCount) res.status(200).json({status:"success"});
        else res.status(400).json({status:"none"});
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({status:"error"});
    })
});

router.put('/update',verifyToken,adminConfirmation,studentCheck,(req,res)=>{
    Management.update({_id:req.body._id},req.body)
    .then((result)=>{
        console.log(result);
        if(result.n) res.status(200).json({status:"success"});
        else res.status(400).json({status:"noMatched"});
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({status:"error"});
    })
});

module.exports = router;