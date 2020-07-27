const express = require('express');
const router = express.Router();
const Portfolio = require('../schemas/portfolio');


router.get("/list",(_,res)=>{
    Portfolio.find({},{_id:true,projectTitle:true,writer:true,date:true,projectTeam:true,view:true})
    .then((portfolio)=>{

    })
    .then(()=>{

    })

});

module.exports = router;