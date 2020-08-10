 const express = require('express');
 const router = express.Router();
 const adminController = require("./controllers/admin.controller");
 const studentController = require("./controllers/user.controller");

// 토큰생성 완료
 router.post('/in',(req,res,next)=>{
    var _id = req.body._id;
     if (typeof _id != 'number'){
        // Admin.find(req.body)//문자열(관계자일때)
        // .then(admin=>{
        //     if(admin.length>0){
        //         res.json({status:"success",_id:admin._id});
        //     }
        //     else{
        //         res.json({status:"wrong"});
        //     }
        // })
        // .catch((err)=>{
        //     console.log(err);
        //     res.json({status:"error"});
        // })
        adminController.createToken(req,res,next);
     }     
     else{//number
        console.log(typeof _id === 'number')
        // Student.find(req.body)//학번
        // .then(student=>{
        //     if(student.length>0){
        //         res.json({status:"success",student:student});
        //     }
        //     else{
        //         res.json({status:"wrong"});
        //     }
            
        // })
        // .catch((err)=>{
        //     console.log(err);
        //     res.json({status:"error"});
        // })
        studentController.createToken(req,res,next)
     }
    
 });

 module.exports = router;

