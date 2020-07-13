const express = require('express');
const app = express();
const router = express.Router();
const subDiv = require("../js/sub-div");

router.get('/',(req,res)=>{
    res.send("계산기 관련 라우터");
});

router.post('/add',(req,res)=>{
    let a = req.body.a;
    let b = req.body.b;
    res.send("더하기: "+a+b);
});

router.post('/mult',(req,res)=>{
    let a = req.body.a;
    let b = req.body.b;
    res.send("곱하기: "+a*b);
});

router.post('/sub',(req,res)=>{
    let a = req.body.a;
    let b = req.body.b;
    let sub = subDiv.sub(a,b);
    res.json({result:sub});
});

router.post('/div',(req,res)=>{
    let a = req.body.a;
    let b = req.body.b;
    let div = subDiv.div(a,b);
    let json = {result:div};
    res.json(json);
});

module.exports = router;
