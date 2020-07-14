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
const calcRouter = require('./router/calc');
app.use('/calc',calcRouter);

app.listen(80, function(){
    console.log("App is running on port 80");
});