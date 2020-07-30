const express = require('express');
const router = express.Router();
const Portfolio = require('../schemas/portfolio');


router.get("/list",(_,res)=>{
    Portfolio.find({},{_id:true,projectTitle:true,writer:true,date:true,projectTeam:true,view:true})
    .then((portfolio)=>{
        // console.log(portfolio);
        res.status(200).json({projectList:portfolio});
    })
    .catch((err)=>{
        console.log(err);
        res.json({status:'error'});
    });

});

module.exports = router;