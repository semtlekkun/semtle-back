const express = require('express');
const router = express.Router();


const qnaRouter = require('./QnA');
router.use('/qna',qnaRouter);

 const loginRouter = require('./log');
 router.use('/log',loginRouter);

const recruitRouter = require('./recruit');
router.use('/recruit', recruitRouter);

const noticeRouter = require('./notice');
router.use('/notice', noticeRouter);

const portfolioRouter = require("./pf");
router.use('/pf',portfolioRouter);

module.exports = router;
