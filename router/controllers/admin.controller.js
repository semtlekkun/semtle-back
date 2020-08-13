const Admin = require("../../schemas/admin");
const jwt = require("jsonwebtoken");
const secretKey = require('../../config/jwt');

module.exports.createToken = function(req,res,next){
    Admin.find(req.body)
    .then((admin)=>{
        if(admin.length){
            const token = jwt.sign({
                id:admin[0]._id,
                isAdmin:true
            },
            secretKey.secret,
            {
                expiresIn:'3h'
            });
            res.status(200).json({
                status:'success',
                token:token,
                admin:true
            });
        }
        else{
            res.status(400).json({
                status:"wrong"
            });
        }
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({status:"error"});
    });
}