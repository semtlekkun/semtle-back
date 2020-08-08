const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 80

var connect = require('./schemas');
connect();

app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log("new request", req.method, req.path, new Date().toLocaleDateString());
    next();
})

app.all('/*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
});

app.use('/question', require('./router/question'));
app.use('/answer', require('./router/answer'));

app.listen(port, function () {
    console.log(`App is running on port ${port}`);
});