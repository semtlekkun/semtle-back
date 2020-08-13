module.exports.adminConfirmation = function(req,res,next){
    if(res.locals.isAdmin) next();
    else res.status(401).json({status:"notAdmin"});
}