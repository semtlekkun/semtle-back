 const express = require('express');
 const router = express.Router();
 const Student = require('../schemas/student');
 const Admin = require('../schemas/admin');

 var admincheck = "ADMIN" || "admin";

 router.post('/login',(req,res)=>{
     var param_id = req.body._id || req.query._id;
     var param_pw = req.body.pw || req.query.pw;
     if (param_id.indexOf(admincheck) != -1){
         Admin.find({},{adminCode:true,pw:true})
         .then((adminCode)=>{
             res.json({status:"success",adminCode:adminCode_});
         })
         .catch((err)=>{
             console.log(err);
             res.json({status:"fail"});
         })
     }
     else{
         Student.find({},{_id:true,pw:true})
         .then((studentCode)=>{
            res.json({status:"success",studentCode:studentCode_});
        })
        .catch((err)=>{
            console.log(err);
            res.json({status:"fail"});
        })
     }
    
 });

 module.exports = router;

