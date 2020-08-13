const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const secretKey = require("../config/jwt");
const student = require('../schemas/student');
const admin = require('../schemas/admin');

const adminConfirmation = require('./middlewares/adminConfirmation');
const verifyToken = require('./middlewares/authorization');

router.get('/', (req, res) => {
    const token = req.header('token');
    if (token == undefined) res.status(403).send({ err: 'token undefined' });
    try {
        const decoded = jwt.verify(token, secretKey.secret);
        if (decoded) {
            console.log(decoded);
        }
        else res.status(401).send({ err: 'token unauthorized' });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});


module.exports = router;