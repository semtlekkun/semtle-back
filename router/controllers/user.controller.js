// user 스키마 필요
const Student = require('../../schemas/student');
const jwt = require("jsonwebtoken");
const secretKey = require("../../config/jwt");

module.exports.createToken = function(req,res,next){
    Student.find(req.body)
    .then((student)=>{
        if(student.length){
            const token = jwt.sign({
                id:student[0]._id,
                isAdmin:false
            },
            secretKey.secret,
            {
                expiresIn:'5m'
            });
            res.json({
                status:'success',
                token:token,
                admin:false
            });
        }
        else{
            res.json({
                status:"wrong"
            });
        }
    })
    .catch((err)=>{
        console.log(err);
        res.json({status:"error"});
     
    });
}

module.exports.checkStudent = function(req,res,next){
    Student.find({_id:req.body.studentCode}).count()
    .then((count)=>{
        if(count) next();
        else res.json({status:"none"});
    })
    .catch((err)=>{
        console.log(err);
        res.json({status:"error"});
    })
}

// ??
module.exports.checkStudentList = function(req,res,next){
    let sl = eval(req.body.students)
    console.log(sl);
    Student.find({_id:{$in:sl}}).count()
    .then((count)=>{
        if(count == sl.length) next();
        else res.json({status:"none"});
    })
    .catch((err)=>{
        console.log(err);
        res.json({status:"error"});
    });
}

// 중복방지 필요
module.exports.createNick = function(studentCode,name)
{
    return studentCode.toString().substring(2,4)+name
    // let createdNick = studentCode.toString().substring(2,4)+name;
    // Student.find({nick:{$regex:createdNick}}).count()
    // .then((c)=>{
    //     console.log(createdNick+(c+1))
    //     if(c !=0)
    //         return createdNick+(c+1)
    //     return createdNick
    // })
}