const express = require('express');
const router = express.Router();
const Student = require('../schemas/student');
const { createNick } = require('./middlewares/createNick');
const { verifyToken } = require("./middlewares/authorization");
const { adminConfirmation } = require('./middlewares/adminConfirmation');
const { checkBlackList } = require("./middlewares/authorization");
const crypto = require("crypto");


router.use('/images', express.static('images/students'));

router.get('/list', verifyToken, checkBlackList, adminConfirmation, (req, res) => {

    Student.find({}, { pw: 0 })
        .then((students) => {
            console.log("myPhoneNuber: " + students[7].phoneNum);
            const decipher = crypto.createDecipher('aes-256-cbc', 'yooncastle');
            let result2 = decipher.update(students[8].phoneNum, 'base64', 'utf8'); // 암호화할문 (base64, ut
            result2 += decipher.final('utf8'); // 암호화할문장 (여기도 base64대신 utf8)
            students[7].phoneNum = result2;
            console.log(students[7].phoneNum);
            res.json({ status: "success", students: students });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ status: "error" });
        })
});

//update를 find>>save로 변경 (.pre('save' ~)로 /input 과 /update 둘다 적용시키기 위해)
router.put('/update', verifyToken, checkBlackList, adminConfirmation, createNick, (req, res) => {

    Student.findOne({ _id: req.body.studentCode })
        .then((student) => {
            //console.log(student.length);
            student.name = req.body.name;
            student.phoneNum = req.body.phoneNum;
            student.nick = res.locals.createdNick;
            if (student) {
                student.save()
                    .then((student) => {
                        console.log(student);
                        res.json({ status: "success" });
                    })
            } else {
                res.status(400).json({ status: "noMatched" });
            }

        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ status: "error" });
        })
    // Student.updateone({ _id: req.body.studentCode },
    //     { $set: { name: req.body.name, nick: res.locals.createdNick, phoneNum: req.body.phoneNum } })
    //     .then((result) => {
    //         console.log(result);
    //         if (result.n) res.json({ status: "success" });
    //         else res.status(400).json({ status: "noMatched" });
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //         res.status(500).json({ status: "error" });
    //     })
});

router.post('/input', verifyToken, checkBlackList, adminConfirmation, createNick, (req, res) => {
    const student = new Student({
        _id: req.body.studentCode,
        pw: req.body.studentCode,
        name: req.body.name,
        nick: res.locals.createdNick,
        phoneNum: req.body.phoneNum,
        image: "default.jpg"
    });
    student.save()
        .then((student) => {
            console.log(student);
            res.json({ status: "success" });
        })
        .catch((err) => {
            console.log(err);
            if (err.keyValue._id != null) res.status(400).json({ status: "duplicate" });
            else res.status(500).json({ status: "error" });
        });
})

router.delete('/delete', verifyToken, checkBlackList, adminConfirmation, (req, res) => {
    Student.remove({ _id: { $in: req.body.ids } })
        .then((result) => {
            if (result.deletedCount) res.json({ status: "success" })
            else res.status(400).json({ status: "none" });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: "error" });
        })
})

module.exports = router;