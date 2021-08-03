// user 스키마 필요
const Student = require('../../schemas/student');
const jwt = require("jsonwebtoken");
const secretKey = require("../../config/jwt");
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const saltRounds = require("../../config/hash").saltRounds;
const KEY = require('../../config/key');
const IV_LENGTH = 16; // For AES, this is always 16
const iv = crypto.randomBytes(IV_LENGTH);


module.exports.createToken = function (req, res, next) {
    Student.findOne({ _id: req.body._id }, { pw: true })
        .then((student) => {
            if (student == null) res.status(400).json({ status: "wrong" });
            bcrypt.compare(req.body.pw, student.pw, function (err, result) {
                if (err) res.status(500).json({ status: "error" });
                if (result) {
                    const token = jwt.sign({
                        id: student._id,
                        isAdmin: false,
                        time: new Date()
                    },
                        secretKey.secret,
                        {
                            expiresIn: '1h'
                        });
                    res.status(200).json({
                        status: 'success',
                        token: token,
                        admin: false
                    });
                }
                else {
                    res.status(400).json({
                        status: "wrong"
                    });
                }
            })
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ status: "error" });
        });
}

module.exports.checkStudent = function (req, res, next) {
    Student.find({ _id: req.body.studentCode }).count()
        .then((count) => {
            if (count) next();
            else res.status(400).json({ status: "none" });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ status: "error" });
        })
}

// ??
module.exports.checkStudentList = function (req, res, next) {
    let sl = eval(req.body.students)
    console.log(sl);
    Student.find({ _id: { $in: sl } }).count()
        .then((count) => {
            if (count == sl.length) next();
            else res.status(400).json({ status: "none" });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ status: "error" });
        });
}

module.exports.createHash = function (req, res, next) {
    bcrypt.hash(req.body.changePW, saltRounds, function (err, hash) {
        if (err) {
            console.log(err);
            res.status(500).json({ status: "error" });
        }
        res.locals.hash = hash;
        next();
    });
}

module.exports.encodePN = function (req, res, next) {
    const cipher = crypto.createCipheriv('aes-256-cbc',
        Buffer.from(KEY.encryption), iv);
    var crypted = cipher.update(req.body.phoneNum);

    crypted = Buffer.concat([crypted, cipher.final()]);
    res.locals.pn = iv.toString('hex') + ':' + crypted.toString('hex');
    next();
}