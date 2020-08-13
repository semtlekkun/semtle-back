module.exports.adminConfirmation = function (req, res, next) {
    if (res.locals.isAdmin) next();
    else res.json({ status: "notAdmin" });
}