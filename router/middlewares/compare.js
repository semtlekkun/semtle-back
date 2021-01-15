const bcrypt = require('bcrypt');
const Student = require('../../schemas/student');

module.exports.compare = function (req, res, next) {
    Student.findOne({ _id: res.locals.id }, { pw: true })
        .then((student) => {
            bcrypt.compare(req.body.currentPW, student.pw, function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ status: "error" });
                }
                if(result) next();
                else res.status(400).json({status: "wrong"});
            })
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({status:"error"});
        })
}