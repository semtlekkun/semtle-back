const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Portfolio = require('../schemas/portfolio');
const Student = require('../schemas/student');
const multer = require("multer");
const format = require('../js/formatDate');
const {verifyToken} = require("./middlewares/authorization");
const {findWriter} = require("./middlewares/findWriter");
const {adminConfirmation} =  require('./middlewares/adminConfirmation');
const {formatDateSend} = require('../js/formatDateSend');

router.use(express.static("images"));

var imageStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./images");
    },
    filename: function (req, file, callback) {
        callback(null, format(new Date()) + '_' + file.originalname);
    }
})

var upload = multer({
    storage: imageStorage
});

router.get("/list/:page", (req, res) => {
    const page = req.params.page;
    Portfolio.find({}).count()
    .then((count)=>{
        Portfolio.find({}, { _id: true, projectTitle: true, writer: true, date: true, projectTeam: true, view: true })
        .sort({ _id: -1 })
        .skip((page - 1) * 10)
        .limit(10)
        .then((portfolio) => {
            // console.log(portfolio);
            res.status(200).json({ status:"success",projectList: portfolio,count:count });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ status: 'error' });
        });
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({status:"error"});
    })
});

router.get('/detail/:id', (req, res) => {
    const _id = req.params.id;
    Portfolio.aggregate([
        {$match:{_id:mongoose.Types.ObjectId(_id)}},
        {
           $lookup:
              {
                 from: "student",
                 localField: "students",
                 foreignField: "_id",
                 as: "studentInfo"
             }
        },
     { $project: { "studentInfo.pw": 0,"studentInfo.name":0,"studentInfo.phoneNum":0 } }
    ])
    .then((pf)=>{
        res.status(200).json({portfolio:pf});
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({status:"error"});
    });
});

// 분리하고 싶은데 .. 
router.post("/input",verifyToken,findWriter,upload.array('projectImages'),(req,res)=>{

    // res.locals.writer = "testWriter";
    let sl = eval(req.body.students);
    Student.find({_id:{$in:sl}}).count()
    .then((count)=>{
        if(count == sl.length) {
            const pf = new Portfolio({
                projectTitle:req.body.projectTitle,
                students:sl,
                contents:req.body.contents,
                link:req.body.link != undefined? req.body.link:null,
                projectStartDate:req.body.projectStartDate,
                projectEndDate:req.body.projectEndDate,
                projectTeamName:req.body.projectTeamName,
                teamLeaderCode:req.body.teamLeaderCode,
                projectImages:req.files.map((image)=>{return image.filename}),
                view:0,
                writer:res.locals.writer,
                date:formatDateSend(new Date())
            });

            pf.save()
            .then(()=>{
                res.status(200).json({status:"success"});
            })
            .catch((err)=>{
                console.log(err);
                res.status(500).json({status:"error"});
            })
        }
        else res.status(400).json({status:"none"});
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({status:"error"});
    });
})

// 관리자 확인 후
router.delete("/delete",verifyToken,adminConfirmation,(req,res)=>{
    Portfolio.remove({_id:req.body._id})
    .then((result)=>{
        if(result.deletedCount) res.status(200).json({status:"success"})
        else res.status(400).json({status:"none"});
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({status:"error"});
    })
})

module.exports = router;