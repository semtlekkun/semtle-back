const express = require('express');
const router = express.Router();

var database = mongoose.connection;
var admin = "ADMIN";

var authUser = function(database,id,password,callback){
    var student = database.collection('student');
    student.find({"_id":_id,"pw":pw}).toArray(function(err,docs){
        if(err){
            callback(err,null);
            return;
        }
        if(docs.length>0){
            if(id.indexOf(admin) != -1){///관리자 아이디 일때
                console.log("관리자 아이디");
                callback(null,docs);//아이디,비밀번호가 일치하는 사용자를 찾았을 때
                var studentCode_ = req.body.studentCode;
                res.send("학번"+studentCode_);
                res.json({status:"success",docs});
            }
            else{
                callback(null,docs);//아이디,비밀번호가 일치하는 사용자를 찾았을 때
                var studentCode_ = req.body.studentCode;
                res.send("학번"+studentCode_);
                res.json({status:"success",docs});
            }
        
        }
        else{
            callback(null,null);
        }
    });
}

router.post('/login',(req,res)=>{
    var param_id = req.body._id || req.query._id;
    var param_pw = req.body.pw || req.query.pw;

    if(database){
     authUser(database,param_id,param_pw,function(err,_docs){//json으로 응답보낼때 비동기방식 주의해서 생각하기
        if(err){throw err;}  
        });
    } 
    
});

module.exports = router;
