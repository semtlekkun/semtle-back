 const express = require('express');
 const router = express.Router();
 
 const Student = require('../schemas/student');
 const Admin = require('../schemas/admin');

 var admincheck = "ADMIN" || "admin";

 router.post('/in',(req,res)=>{
     var input_id = req.body._id;
     var input_pw = req.body.pw;
     if (typeof input_id != 'number'){
        Admin.find({},{"_id":input_id , "pw":input_pw})//문자열(관계자일때)
        .then((_id,pw)=>{
            if((input_id === _id) &&(input_pw === pw)){//-->다 wrong으로 뜬다. _id가 배열이기 때문
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
        Student.find({},{"_id":input_id , "pw":input_pw})//문자열(관계자일때)
        .then((_id,pw)=>{
            if(_id.length>0){//--->다 success로 뜬다.(수정 필요)
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

