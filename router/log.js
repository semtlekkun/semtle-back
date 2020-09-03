const express = require('express');
const router = express.Router();
const adminController = require("./controllers/admin.controller");
const studentController = require("./controllers/user.controller");

 router.post('/in',(req,res,next)=>{
    var _id = req.body._id;
     if (_id.indexOf("AD") != -1){
        adminController.createToken(req,res,next);
     }     
     else{
        studentController.createToken(req,res,next)
     }
 });

 router.post('/out',(req,res,next)=>{
    console.log(req.body.pw);
   res.json({status:"success"});
 });

module.exports = router;

