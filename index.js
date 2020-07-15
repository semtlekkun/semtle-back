const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var connect = require('./schemas');
connect();

app.use(bodyParser.json());

app.use((req,res,next)=>{
    console.log("new request",req.method, req.path, new Date().toLocaleDateString());
    next();
})

app.all('/*',(req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
});

const calcRouter = require('./router/calc');
app.use('/calc',calcRouter);
const qnaRouter = require('./router/QnA');
app.use('/qna',qnaRouter);

app.listen(80, function(){
    console.log("App is running on port 80");
});