const express = require('express');
const router = express.Router();
const Student = require('../schemas/student');
const { verifyToken } = require('./middlewares/authorization');
const {compare} = require('./middlewares/compare');
const imageUploader = require('./controllers/image.controller').imageUpload;

router.put('/picture/update', verifyToken, imageUploader("images/students").single("image"), (req, res) => {

    Student.findOneAndUpdate({ _id: res.locals.id }, {
        $set: { image: req.file != undefined? req.file.filename:null }
    }, { projection: { pw: false }, new: true })
        .exec().then((studentList) => {
            console.log(studentList.image);
            res.status(200).json({ status: "success"});
        })
        .catch(err => res.status(500).send(err));
});

router.put('/pw/update', verifyToken,compare, (req, res) => {

    Student.update({ _id: res.locals.id }, {
        $set: { pw: req.body.changePW }
    }).then(() => {
        res.status(200).json({ status: "success" });
    })
        .catch(err => {
            console.log(err);
            res.status(500).send(err)});
});


module.exports = router;