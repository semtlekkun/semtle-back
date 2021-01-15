const Student = require('../../schemas/student');
const Admin = require('../../schemas/admin');
module.exports.findWriter = function (req, res, next) {
    if (res.locals.isAdmin) {
        Admin.findOne({ _id: res.locals.id }, { nick: true })
            .then((admin) => {
                res.locals.writer = admin.nick;
                next();
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ status: "error" });
            })
    }
    else {
        Student.findOne({ _id: res.locals.id }, { nick: true })
            .then((student) => {
                res.locals.writer = student.nick;
                next();
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ status: "error" });
            })
    }
}