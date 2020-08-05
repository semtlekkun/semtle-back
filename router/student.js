const express = require('express');
const router = express.Router();
const Student = require('../schemas/student');
const createNick = require('../js/createNick');
// 학번 고학번이 뒤

// 모두 관리자라는 인증이 필요함 (추가예정)
// 임시 비밀번호 학번: 완료
// 비밀번호는 해쉬화 후 저장해야함 (추가예정)
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
            res.json({ status:"success",students: students,count:count });
        })
        .catch((err)=>{
            console.log(err);
            res.json({status:"error"});
        })
    })
    .catch((err)=>{
        console.log(err);
        res.json({status:"error"});
    })
});

// 닉네임도 바뀐 이름에 맞게 수정해야함: 완료
router.put('/update',(req,res)=>{
    Student.update({_id:req.body.studentCode},
        { $set: {name:req.body.name, nick:createNick(req.body.studentCode,req.body.name) ,phoneNum:req.body.phoneNum }})
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

// 비밀번호 해시화 필요
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
        res.json({status:"success"});
    })
    .catch((err)=>{
        console.log(err);
        console.log(err.keyValue)
        if(err.keyValue._id) res.json({status:"duplicate"});
        else res.json({status:"error"});
    });
})

router.delete('/delete',(req,res)=>{
    Student.remove({_id:req.body.studentCode})
    .then((result)=>{
        if(result.deletedCount) res.json({status:"success"})
        else res.json({status:"none"});
    })
    .catch(err=>{
        console.log(err);
        res.json({status:"error"});
    })
})


module.exports = router;