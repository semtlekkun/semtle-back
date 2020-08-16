const jwt = require("jsonwebtoken");
const secretKey = require("../../config/jwt");

module.exports.verifyToken = (req, res, next) => {
    const token = req.header('token');
    if (token == undefined) res.status(401).json({ status: "tokenMissing" })
    try {
        const decoded = jwt.verify(token, secretKey.secret);
        if (decoded) {
            res.locals.isAdmin = decoded.isAdmin
            res.locals.id = decoded.id
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

