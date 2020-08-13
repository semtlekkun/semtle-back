const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
const port = process.env.PORT || 80


const connect = require('./schemas');
connect();

app.use(cors({origin:true,credentials: true}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log("new request", req.method, req.path, new Date().toLocaleDateString());
    next();
})

app.all('/*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, token"
    );
    next();
});

const routers = require('./router');
app.use('/api', routers);

app.listen(port, function () {
    console.log(`App is running on port ${port}`);
});