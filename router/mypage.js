const express = require('express');
const router = express.Router();
const Student = require('../schemas/student');
const { verifyToken } = require('./middlewares/authorization');
const { compare } = require('./middlewares/compare');
const imageUploader = require('./controllers/image.controller').imageUpload;
const createHash = require('./controllers/user.controller').createHash;

router.get('/', verifyToken, (req, res) => {
    Student.findOne({ _id: res.locals.id }, { pw: 0 })
        .then(student => { res.json({ status: "success", student: student }) })
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: "error" });
        })
})

router.put('/picture/update', verifyToken, imageUploader("images/students").single("image"), (req, res) => {

    Student.findOneAndUpdate({ _id: res.locals.id }, {
        $set: { image: req.file != undefined ? req.file.filename : "default.jpg" }
    }, { projection: { pw: false }})
        .exec().then((student) => {
            console.log(student.image);
            res.json({ status: "success" });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: "error" })
        });
});

router.put('/phoneNum/update', verifyToken, (req, res) => {

    Student.findOneAndUpdate({ _id: res.locals.id }, {
        $set: { phoneNum: req.body.phoneNum }
    }, { projection: { pw: false } })
        .then(() => {
            res.json({ status: "success" });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        });
});

router.put('/pw/update', verifyToken, compare,createHash, (req, res) => {
    Student.update({_id:res.locals.id},{$set:{pw:res.locals.hash}})
    .then(()=>{
        res.json({status:"success"});
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({status:"success"});
    })
});


module.exports = router;