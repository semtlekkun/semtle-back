const express = require('express');
const router = express.Router();

const qnaRouter = require('./QnA');
router.use('/qna', qnaRouter);

const recruitRouter = require('./recruit');
router.use('/recruit', recruitRouter);

const noticeRouter = require('./notice');
router.use('/notice', noticeRouter);

const portfolioRouter = require("./pf");
router.use('/pf',portfolioRouter);

const studentRouter = require("./student");
router.use('/student',studentRouter);

const managementRouter = require('./management');
router.use('/management',managementRouter);

module.exports = router;
