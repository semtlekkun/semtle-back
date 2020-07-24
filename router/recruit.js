const express = require('express');
const router = express.Router();
const Recruit = require('../schemas/recruit');
const Student = require('../schemas/student');


router.get('/list', (req, res) => {
    Recruit.find({}, { date: false, contents: false })
        .then((recruitList) => {
            res.json({ status: "success", recruitList: recruitList });
        })
        .catch((err) => {
            console.log(err);
            res.json({ status: "fail" });
        });
});


router.get('/detail/:id', (req, res) => {

    var _id = req.params.id;
    var nick;
    var studentCode;
    Recruit.findOne({ _id: _id })
        .then((recruitList) => {
            studentCode = recruitList.writer;
            studentCode *= 1;
            Student.findOne({ studentCode: studentCode })
                .then((studentList) => {
                    nick = studentList.nick;
                    //res.json({ status: "success", studentList: studentList });
                    recruitList.writer = nick;
                    res.json({ status: "success", recruitList: recruitList });
                })
                .catch((err) => {
                    console.log(err);
                    res.json({ status: "fail" });
                });
        })
        .catch((err) => {
            console.log(err);
            res.json({ status: "fail" });
        });


});

router.post('/input', (req, res) => {

    var writer = req.body.writer;
    var date = req.body.date;
    var endDate = req.body.endDate;
    var recruitment = req.body.recruitment;
    var title = req.body.title;
    var contents = req.body.contents;

    Recruit.create({
        writer: writer, date: date, endDate: endDate,
        recruitment: recruitment, title: title,
        contents: contents, view: 0
    }, function (err) {
        if (err) {
            return handleError(err);
        }
        else {
            res.json({ status: "success" });
        }
    });

});


module.exports = router;