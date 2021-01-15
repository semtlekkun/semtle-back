const express = require('express');
const router = express.Router();
const Management = require('../schemas/management');
const Student = require('../schemas/student');
const studentCheck = require('./controllers/user.controller').checkStudent;
const {verifyToken} = require("./middlewares/authorization");
const {adminConfirmation} =  require('./middlewares/adminConfirmation');
const { checkBlackList } = require("./middlewares/authorization");
const answer = require('../schemas/answer');

router.get('/list',(req,res)=>{

    Management.find({})
    .then(management=>{
        management.forEach(async (el,index) => {
            await Student.findOne({_id:el.studentCode},{name:1,image:1})
            .then(student=>{
                console.log(index)
                management[index].name = student.name
                management[index].image = student.image
            })
            .catch((err)=>{
                console.log(err);
                res.status(500).json({status:"error"});
            });
            if(index == management.length -1)
            {
                res.json({status:"success",management:management});
            }
        });
        
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({status:"error"});
    })
});

router.post('/input',verifyToken,checkBlackList,adminConfirmation,studentCheck,(req,res)=>{
    const management = new Management(req.body);
    management.save()
    .then(()=>{
        res.json({status:"success"});
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({status:"error"});
    });
})

router.delete('/delete',verifyToken,checkBlackList,adminConfirmation,(req,res)=>{
    Management.remove({_id:req.body._id})
    .then((result)=>{
        if(result.deletedCount) res.json({status:"success"});
        else res.status(400).json({status:"none"});
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({status:"error"});
    })
});

router.put('/update',verifyToken,checkBlackList,adminConfirmation,studentCheck,(req,res)=>{
    Management.update({_id:req.body._id},req.body)
    .then((result)=>{
        console.log(result);
        if(result.n) res.json({status:"success"});
        else res.status(400).json({status:"noMatched"});
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({status:"error"});
    })
});

module.exports = router;