const express = require('express');
const router = express.Router();
const Student = require('../schemas/student');
const Portfolio = require('../schemas/portfolio');
const { verifyToken } = require('./middlewares/authorization');
const { compare } = require('./middlewares/compare');
const imageUploader = require('./controllers/image.controller').imageUpload;
const createHash = require('./controllers/user.controller').createHash;
const { checkBlackList } = require("./middlewares/authorization");
const imageCleaner = require('./controllers/image.controller').imageClean;
const crypto = require("crypto");
const KEY = require('../config/key');


router.get('/', verifyToken, checkBlackList, (req, res) => {
    if (res.locals.isAdmin) res.json({ status: "admin" });
    Student.findOne({ _id: res.locals.id }, { pw: 0 })
        .then(student => {
            let phonNumParts = student.phoneNum.split(':');
            let iv = Buffer.from(phonNumParts.shift(), 'hex');
            let encrypted = Buffer.from(phonNumParts.join(':'), 'hex');
            //console.log("myPhoneNuber: " + students[7].phoneNum);
            const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(KEY.encryption), iv);
            let decrypted = decipher.update(encrypted); // 암호화할문 (base64, ut

            decrypted = Buffer.concat([decrypted, decipher.final()]);
            student.phoneNum = decrypted.toString();


            Portfolio.find({ students: res.locals.id })
                .then(pfList => {
                    student.pfList = pfList == null ? undefined : pfList;
                    res.json({ status: "success", student: student })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ status: "error" });
                });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: "error" });
        })
})

router.put('/picture/update', verifyToken, checkBlackList, imageUploader("images/students").single("image"), (req, res) => {
    Student.findOneAndUpdate({ _id: res.locals.id }, {
        $set: { image: req.file != undefined ? req.file.filename : "default.jpg" }
    }, { projection: { pw: false } })
        .exec().then((student) => {
            // if(student.image !="default.jpg"){
            //     imageCleaner("images/students/",student.image);
            // }                
            console.log(student.image);
            res.json({ status: "success" });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: "error" })
        });
});

router.put('/phoneNum/update', verifyToken, checkBlackList, (req, res) => {

    Student.update({ _id: res.locals.id }, {
        $set: { phoneNum: req.body.phoneNum }
    })
        .then(() => {
            res.json({ status: "success" });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        });
});

router.put('/pw/update', verifyToken, checkBlackList, compare, createHash, (req, res) => {
    Student.update({ _id: res.locals.id }, { $set: { pw: res.locals.hash } })
        .then(() => {
            res.json({ status: "success" });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: "success" });
        })
});


module.exports = router;