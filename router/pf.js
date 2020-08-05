const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Portfolio = require('../schemas/portfolio');
const Student = require('../schemas/student');
const multer = require("multer");
const format = require('../js/formatDate');
const checkStudentList = require('./controllers/user.controller').checkStudentList;

router.use(express.static("images/portfolioImages"));

var imageStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./images/portfolioImages/");
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
            res.json({ status: 'error' });
        });
    })
    .catch((err)=>{
        console.log(err);
        res.json({status:"error"});
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
        res.json({portfolio:pf});
    })
    
});

// 회원확인 후 
// 이미지 여러개 저장해야댐
// 회원명단에서 모두 셈틀인지 확인해야함: 완료
// 분리하고 싶은데 .. 

router.post("/input",upload.array('projectImages'),(req,res)=>{
    // res.locals.t = "test";
    // console.log(req.files);
    // res.json({t:res.locals.t})
    // console.log(projectImages);
    // console.log(req.body.link)
    // console.log(typeof(req.body.students))
    res.locals.writer = "testWriter";
    console.log(req.body.students);
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
                prijectEndDate:req.body.prijectEndDate,
                projectTeamName:req.body.projectTeamName,
                teamLeaderCode:req.body.teamLeaderCode,
                projectImages:req.files.map((image)=>{return image.filename}),
                view:0,
                writer:res.locals.writer,
                date:req.body.date
            });

            pf.save()
            .then(()=>{
                res.json({status:"success"});
            })
            .catch((err)=>{
                console.log(err);
                res.json({status:"error"});
            })
        }
        else res.json({status:"none"});
    })
    .catch((err)=>{
        console.log(err);
        res.json({status:"error"});
    });
})

// 관리자 확인 후
router.delete("/delete",(req,res)=>{
    Portfolio.remove({_id:req.body.id})
    .then((result)=>{
        if(result.deletedCount) res.json({status:"success"})
        else res.json({status:"none"});
    })
    .catch((err)=>{
        console.log(err);
        res.json({status:"error"});
    })
})

module.exports = router;