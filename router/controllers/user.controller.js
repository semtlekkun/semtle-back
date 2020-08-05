// user 스키마 필요
const Student = require('../../schemas/student');

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

