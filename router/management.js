const express = require('express');
const router = express.Router();
const Management = require('../schemas/management');
const studentCheck = require('./controllers/user.controller').checkStudent;
const {verifyToken} = require("./middlewares/authorization");
const {adminConfirmation} =  require('./middlewares/adminConfirmation');
// 마찬가지로 관리자라는 확인이 필요

// 카운트 추가
router.get('/list/:page',(req,res)=>{
    const page = req.params.page;
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
        },
        {$skip:(page - 1) * 3},
        {$limit:3}
    ])
    .then((management)=>{
        res.status(200).json({status:"success",management:management});
    })
});

// 원래 있는 학번인가? 확인이 필요! : 완료
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

// 관리자 확인 필요함: 완료
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
    Management.update({_id:req.body._id},
        { $set: {season:req.body.season,studentCode:req.body.studentCode ,contents:req.body.contents }})
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