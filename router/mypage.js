const express = require('express');
const router = express.Router();
const Student = require('../schemas/student');
const { verifyToken } = require('./middlewares/authorization');
const multer = require('multer');
const format = require('../js/formatDate');
const bcrypt = require('bcrypt');
const saltRounds = require("../config/hash").saltRounds;

var imageStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./images/students");
    },
    filename: function (req, file, callback) {
        //파일명 설정
        callback(null, format(new Date()) + '_' + file.originalname);
    }
});

var upload = multer({
    storage: imageStorage
});


router.put('/picture/update', verifyToken, upload.single("img"), (req, res) => {
    var image;
    if (req.file != undefined)
        image = req.file.filename
    else image = null;
    Student.findOneAndUpdate({ _id: res.locals.id }, {
        $set: { image: image }
    }, { projection: { pw: false }, new: true })
        .exec().then((studentList) => {
            console.log(studentList.image);
            res.status(200).json({ status: "success", studentList: studentList });
        })
        .catch(err => res.status(500).send(err));

});


router.put('/pw/update', verifyToken, (req, res) => {


    Student.findOne({ _id: res.locals.id })
        .then((student) => {
            bcrypt.compare(req.body.currentPW, student.pw, function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(500).json({ status: "error" });
                }
                if (result) {

                    bcrypt.hash(req.body.changePW, saltRounds, function (err, hash) {
                        // Store hash in your password DB.
                        if (err) {
                            console.log(err);
                            res.json({ status: "error" });
                        } else {

                            Student.findOneAndUpdate({ _id: res.locals.id }, {
                                $set: { pw: hash }
                            }).then(() => {
                                res.status(200).json({ status: "success" });
                            })
                                .catch(err => res.status(500).send(err));

                        }

                    });



                }
                else {//compareErr
                    res.status(400).json({
                        status: "wrong"
                    });
                }
            })


        })//findeErr
        .catch((err) => {
            console.log(err);
            res.status(500).json({ status: "error" });
        });

});


module.exports = router;