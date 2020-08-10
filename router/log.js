 const express = require('express');
 const router = express.Router();
 const adminController = require("./controllers/admin.controller");
 const studentController = require("./controllers/user.controller");

// 토큰생성 완료
 router.post('/in',(req,res,next)=>{
    var _id = req.body._id;
     if (typeof _id != 'number'){
        adminController.createToken(req,res,next);
     }     
     else{//number
        studentController.createToken(req,res,next)
     }
    
 });

 module.exports = router;

