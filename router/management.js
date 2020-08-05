const express = require('express');
const router = express.Router();
const Management = require('../schemas/management');
const studentCheck = require('./controllers/user.controller').checkStudent;
// 마찬가지로 관리자라는 확인이 필요

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
        res.json({status:"success",management:management});
    })
});

// 원래 있는 학번인가? 확인이 필요! : 완료
router.post('/input',studentCheck,(req,res)=>{
    const management = new Management({
        season:req.body.season,
        studentCode:req.body.studentCode,
        contents:req.body.contents
    });

    management.save()
    .then(()=>{
        res.json({status:"success"});
    })
    .catch((err)=>{
        console.log(err);
        res.json({status:"error"});
    });
})

// 원래는 studentCode 였으나 아이디를 받는게 나을거같음.
router.delete('/delete',(req,res)=>{
    Management.remove({_id:req.body.id})
    .then((result)=>{
        if(result.deletedCount) res.json({status:"success"});
        else res.json({status:"none"});
    })
    .catch((err)=>{
        console.log(err);
        res.json({status:"error"});
    })
});

router.put('/update',studentCheck,(req,res)=>{
    Management.update({_id:req.body.id},
        { $set: {season:req.body.season,studentCode:req.body.studentCode ,contents:req.body.contents }})
    .then((result)=>{
        console.log(result);
        if(result.n) res.json({status:"success"});
        else res.json({status:"noMatched"});
    })
    .catch((err)=>{
        console.log(err);
        res.json({status:"error"});
    })
});


module.exports = router;