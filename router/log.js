 const express = require('express');
 const router = express.Router();
 
 const Student = require('../schemas/student');
 const Admin = require('../schemas/admin');

 var admincheck = "ADMIN" || "admin";

 router.post('/in',(req,res)=>{
    var _id = req.body._id;
    var pw = req.body.pw;
     if (typeof _id != 'number'){
        Admin.find({},{"_id":_id , "pw":pw})//문자열(관계자일때)
        .then((_id,pw)=>{
            if(_id.length>0){
                res.json({status:"success",_id:_id});
            }
            else{
                res.json({status:"wrong"});
            }
            
        })
        .catch((err)=>{
            console.log(err);
            res.json({status:"error"});
        })
     }     
     else if(typeof input_id ==='number'){//number
        Student.find({},{_id:_id ,pw:pw})//학번
        .then((_id,pw)=>{
            if(_id.length>0){
                res.json({status:"success",_id:_id});
            }
            else{
                res.json({status:"wrong"});
            }
            
        })
        .catch((err)=>{
            console.log(err);
            res.json({status:"error"});
        })
         
     }
    
 });

 module.exports = router;

