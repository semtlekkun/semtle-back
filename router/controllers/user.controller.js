// user 스키마 필요
const Student = require('../../schemas/student');

module.exports.createToken = function(req,res,next){
    Student.find(req.body)
    .then((student)=>{
        if(student.length){
            const token = jwt.sign({
                studentID:student[0]._id
            },
            secretKey.secret,
            {
                expiresIn:'5m'
            });
            res.json({
                status:'success',
                token:token,
                admin:true
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

