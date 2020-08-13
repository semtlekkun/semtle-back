const express = require('express');
const router = express.Router();
const Student = require('../schemas/student');
const createNick = require('./controllers/user.controller').createNick;

// 이미 상위에 해놧음.
// const {verifyToken} = require("./middlewares/authorization");
// const {adminConfirmation} =  require('./middlewares/adminConfirmation');

// 비밀번호는 해쉬화 후 저장해야함 완료
// 전화번호, 이메일 등은 암호화 후 저장해야 함 (추가예정)
// 에러 핸들러를 만들어야 함

router.get('/list/:page',(req,res)=>{
    const page = req.params.page;
    Student.find({}).count()
    .then((count)=>{
        Student.find({},{_id:1,phoneNum:1,name:1})
        .sort({ _id: -1 })
        .skip((page - 1) * 10)
        .limit(10)
        .then((students)=>{
            res.status(200).json({ status:"success",students: students,count:count });
        })
        .catch((err)=>{
            console.log(err);
            res.status(500).json({status:"error"});
        })
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({status:"error"});
    })
});

// 닉네임도 바뀐 이름에 맞게 수정해야함: 완료
router.put('/update',(req,res)=>{
    Student.update({_id:req.body.studentCode},
        { $set: {name:req.body.name, nick:createNick(req.body.studentCode,req.body.name) ,phoneNum:req.body.phoneNum }})
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

router.post('/input',(req,res)=>{
    const student = new Student({
        _id:req.body.studentCode,
        pw:req.body.studentCode,
        name:req.body.name,
        nick:createNick(req.body.studentCode,req.body.name),
        phoneNum:req.body.phoneNum,
        image:"default.jpg"
    });
    student.save()
    .then(()=>{
        res.status(200).json({status:"success"});
    })
    .catch((err)=>{
        console.log(err);
        if(err.keyValue._id) res.status(400).json({status:"duplicate"});
        else res.status(500).json({status:"error"});
    });
})

// 관리자 확인이 필요
router.delete('/delete',(req,res)=>{
    Student.remove({_id:req.body.studentCode})
    .then((result)=>{
        if(result.deletedCount) res.status(200).json({status:"success"})
        else res.status(400).json({status:"none"});
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({status:"error"});
    })
})

module.exports = router;