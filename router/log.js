const express = require('express');
const router = express.Router();
const adminController = require("./controllers/admin.controller");
const studentController = require("./controllers/user.controller");
const blacklist = require('../schemas/blacklist');
const { checkBlackList } = require("./middlewares/authorization");
router.post('/in', checkBlackList, (req, res, next) => {
   var _id = req.body._id;
   if (_id.indexOf("AD") != -1) {
      adminController.createToken(req, res, next);
   }
   else {
      studentController.createToken(req, res, next)
   }
});

router.post('/out', (req, res, next) => {
   //const token = req.header('token');
   blacklist.create({
      token: req.header('token')

   }, function (err) {
      if (err) {
         console.log(err)
         res.status(500).json({ status: "error" });
      }
      else {
         res.json({ status: "success" });
      }
   });


});

module.exports = router;

