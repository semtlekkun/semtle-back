const express = require('express');
const router = express.Router();
const Student = require('../schemas/student');
const Portfolio = require('../schemas/portfolio');
const { verifyToken } = require('./middlewares/authorization');
const { compare } = require('./middlewares/compare');
const imageUploader = require('./controllers/image.controller').imageUpload;
const createHash = require('./controllers/user.controller').createHash;
const imageCleaner = require('./controllers/image.controller').imageClean;

router.get('/', verifyToken, (req, res) => {
    if(res.locals.isAdmin) res.json({status:"admin"});
    Student.findOne({ _id: res.locals.id }, { pw: 0 })
        .then(student => {
            Portfolio.find({ students: res.locals.id })
                .then(pfList => {
                    student.pfList = pfList == null? undefined:pfList;
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

router.put('/picture/update', verifyToken, imageUploader("images/students").single("image"), (req, res) => {
    Student.findOneAndUpdate({ _id: res.locals.id }, {
        $set: { image: req.file != undefined ? req.file.filename : "default.jpg" }
    }, { projection: { pw: false } })
        .exec().then((student) => {
            if(student.image !="default.jpg"){
                imageCleaner("images/students/",student.image);
            }                
            console.log(student.image);
            res.json({ status: "success" });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: "error" })
        });
});

router.put('/phoneNum/update', verifyToken, (req, res) => {

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

router.put('/pw/update', verifyToken, compare, createHash, (req, res) => {
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