const jwt = require("jsonwebtoken");
const secretKey = require("../../config/jwt");
const blacklist = require('../../schemas/blacklist');


module.exports.verifyToken = (req, res, next) => {
    const token = req.header('token');
    console.log("토큰" + token)
    if (token == undefined) res.status(401).json({ status: "tokenMissing" })
    try {
        const decoded = jwt.verify(token, secretKey.secret);
        if (decoded) {
            res.locals.isAdmin = decoded.isAdmin
            res.locals.id = decoded.id
            res.locals.time = decoded.time
            next();
        }
        else {
            res.status(500).json({ status: "unauthorized" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(401).json({ status: "tokenExpired" });
    }
}

module.exports.checkBlackList = (req, res, next) => {
    const token = req.header('token');
    blacklist.find({ token: token }).countDocuments()
        .then((count) => {
            if (count) res.status(401).json({ status: "tokenInBlacklist" });
            else next();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ status: "error" });
        })
}


