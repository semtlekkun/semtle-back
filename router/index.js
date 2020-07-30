const express = require('express');
const router = express.Router();


const qnaRouter = require('./QnA');
<<<<<<< HEAD
router.use('/qna',qnaRouter);
const loginRouter = require('./login');
router.use('/login',loginRouter);
=======
router.use('/qna', qnaRouter);

const recruitRouter = require('./recruit');
router.use('/recruit', recruitRouter);

const noticeRouter = require('./notice');
router.use('/notice', noticeRouter);

const portfolioRouter = require("./pf");
router.use('/pf',portfolioRouter);
>>>>>>> ys-kb


module.exports = router;
