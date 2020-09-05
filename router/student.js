const express = require('express');
const router = express.Router();
const Student = require('../schemas/student');
const { createNick } = require('./middlewares/createNick');
const { verifyToken } = require("./middlewares/authorization");
const { adminConfirmation } = require('./middlewares/adminConfirmation');
const { checkBlackList } = require("./middlewares/authorization");

router.use('/images',express.static('images/students'));

router.get('/list', verifyToken,checkBlackList, adminConfirmation, (req, res) => {

    Student.find({}, { pw: 0 })
        .then((students) => {
            res.json({ status: "success", students: students });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ status: "error" });
        })
});

router.put('/update', verifyToken,checkBlackList, adminConfirmation, createNick, (req, res) => {
    Student.update({ _id: req.body.studentCode },
        { $set: { name: req.body.name, nick: res.locals.createdNick, phoneNum: req.body.phoneNum } })
        .then((result) => {
            console.log(result);
            if (result.n) res.json({ status: "success" });
            else res.status(400).json({ status: "noMatched" });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ status: "error" });
        })
});

router.post('/input', verifyToken,checkBlackList, adminConfirmation, createNick, (req, res) => {
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

router.delete('/delete', verifyToken,checkBlackList, adminConfirmation, (req, res) => {
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