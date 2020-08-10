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
                expiresIn:'5m'
            });
            res.json({
                status:'success',
                token:token,
                admin:true
            });
        }
        else{
            res.json({
                status:"wrong"
            });
        }
    })
    .catch((err)=>{
        console.log(err);
        res.json({status:"error"});
    
    });
}