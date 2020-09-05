const Admin = require("../../schemas/admin");
const jwt = require("jsonwebtoken");
const secretKey = require('../../config/jwt');
const bcrypt = require('bcrypt');
const { formatDate } = require('../../js/formatDate');

module.exports.createToken = function (req, res, next) {
    Admin.findOne({ _id: req.body._id }, { pw: true })
        .then((admin) => {
            if (admin == null) res.status(400).json({ status: "wrong" });
            bcrypt.compare(req.body.pw, admin.pw, function (err, result) {
                if (err) res.status(500).json({ status: "error" });
                if (result) {
                    const token = jwt.sign({
                        id: admin._id,
                        isAdmin: true,
                        time: formatDate(new Date())
                    },
                        secretKey.secret,
                        {
                            expiresIn: '6h'
                        });
                    res.status(200).json({
                        status: 'success',
                        token: token,
                        admin: true
                    });
                }
                else {
                    res.status(400).json({
                        status: "wrong"
                    });
                }
            })
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ status: "error" });
        });
}