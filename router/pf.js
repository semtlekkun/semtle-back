const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Portfolio = require('../schemas/portfolio');
const Student = require('../schemas/student');
const { verifyToken } = require("./middlewares/authorization");
const { findWriter } = require("./middlewares/findWriter");
const { adminConfirmation } = require('./middlewares/adminConfirmation');
const { formatDateSend } = require('../js/formatDateSend');
const imageUploader = require('./controllers/image.controller').imageUpload;

router.use(express.static('images/portfolios'));

router.get('/list', (req, res) => {
    Portfolio.find({}).count()
        .then((count) => {
            Portfolio.find({}, { _id: true, projectTitle: true, writer: true, date: true, projectTeam: true, view: true }).sort({ _id: -1 })
                .then((portfolioList) => {
                    res.json({ status: "success", count: count, portfolioList: portfolioList });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ status: "error" })
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ status: "error" });
        })
})

router.get("/list/:page", (req, res) => {
    const page = req.params.page;
    Portfolio.find({}).count()
        .then((count) => {
            Portfolio.find({}, { _id: true, projectTitle: true, writer: true, date: true, projectTeam: true, view: true })
                .sort({ _id: -1 })
                .skip((page - 1) * 10)
                .limit(10)
                .then((portfolio) => {
                    res.json({ status: "success", count: count, projectList: portfolio });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({ status: 'error' });
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ status: "error" });
        })
});

router.get('/:portfolioId', (req, res) => {
    const _id = req.params.portfolioId;
    Portfolio.update({ _id: mongoose.Types.ObjectId(_id) }, { $inc: { view: 1 } })
        .then(() => {
            Portfolio.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(_id) } },
                {
                    $lookup:
                    {
                        from: "student",
                        localField: "students",
                        foreignField: "_id",
                        as: "studentInfo"
                    }
                },
                { $project: { "studentInfo.pw": 0, "studentInfo.name": 0, "studentInfo.phoneNum": 0 } }
            ])
                .then((pf) => {

                    pf.view = +1;
                    res.json({ portfolio: pf[0] });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({ status: "error" });
                });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({status:"error"});
        })
});

// 분리하고 싶은데 .. 
router.post("/", verifyToken, findWriter, imageUploader('images/portfolios').array('projectImages'), (req, res) => {

    let sl = req.body.students.split(',');
    Student.find({ _id: { $in: sl } }).count()
        .then((count) => {
            if (count == sl.length) {
                Student.findOne({ _id: req.body.teamLeaderCode }, { nick: true })
                    .then((student) => {
                        if (student == null) res.status(400).json({ status: "none" });
                        const pf = new Portfolio({
                            projectTitle: req.body.projectTitle,
                            students: sl,
                            contents: req.body.contents,
                            link: req.body.link != undefined ? req.body.link : null,
                            projectStartDate: req.body.projectStartDate,
                            projectEndDate: req.body.projectEndDate,
                            projectTeamName: req.body.projectTeamName,
                            leaderNick: student.nick,
                            projectImages: req.files.map((image) => { return image.filename }),
                            view: 0,
                            writer: res.locals.writer,
                            date: formatDateSend(new Date())
                        });

                        pf.save()
                            .then(() => {
                                res.json({ status: "success" });
                            })
                            .catch((err) => {
                                console.log(err);
                                res.status(500).json({ status: "error" });
                            })
                    })

            }
            else res.status(400).json({ status: "none" });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ status: "error" });
        });
})

router.delete("/:portfolioId", verifyToken, adminConfirmation, (req, res) => {
    Portfolio.remove({ _id: req.params.portfolioId })
        .then((result) => {
            if (result.deletedCount) res.json({ status: "success" })
            else res.status(400).json({ status: "none" });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ status: "error" });
        })
})

module.exports = router;