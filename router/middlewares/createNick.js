const Student = require('../../schemas/student');
// 중복방지 필요
module.exports.createNick = function(req,res,next)
{
    let createdNick = req.body.studentCode.substring(2,4)+req.body.name;
    Student.find({nick:{$regex:createdNick}}).count()
    .then((c)=>{
        if(c > 0) res.locals.createdNick= createdNick+(c+1);
        else res.locals.createdNick= createdNick;
        next();
    })
}