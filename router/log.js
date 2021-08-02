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
   // 남은 시간 = 토큰 유효시간 - (현재 - 토큰 생성 시점)
   let timeInterval = 3600000 - (new Date() - new Date(res.locals.time));
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
         .then(() => { })
         .catch((err) => { console.log(err) })
   }, timeInterval) //timeInterval이 음수일 경우 최소 지연시간(4ms) 이후 실행  
});

module.exports = router;

