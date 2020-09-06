const express = require('express');
const router = express.Router();
const adminController = require("./controllers/admin.controller");
const studentController = require("./controllers/user.controller");
const { verifyToken } = require("./middlewares/authorization");
const blacklist = require('../schemas/blacklist');

router.post('/in', (req, res, next) => {
   var _id = req.body._id;
   if (_id.indexOf("AD") != -1) adminController.createToken(req, res, next);
   else studentController.createToken(req, res, next)
});

router.post('/out', verifyToken, (req, res, next) => {
   let timeInterval = new Date(res.locals.time) - new Date() + 300000;
   blacklist.create({
      token: req.header('token')
   }, function (err) {
      if (err) {
         console.log(err)
         res.status(500).json({ status: "error" });
      }
      else res.json({ status: "success" });
   });
   setTimeout(() => {
      blacklist.deleteOne({ token: req.header('token') })
      .then(()=>{})
      .catch((err)=>{console.log(err)})
   }, timeInterval)
});

module.exports = router;

