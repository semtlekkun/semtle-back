const express = require('express');
const router = express.Router();

router.use(express.static('images'));

const loginRouter = require('./log');
router.use('/log', loginRouter);

const recruitRouter = require('./recruit');
router.use('/recruit', recruitRouter);

const noticeRouter = require('./notice');
router.use('/notice', noticeRouter);

const portfolioRouter = require("./pf");
router.use('/pf', portfolioRouter);

const studentRouter = require("./student");
router.use('/student', studentRouter);

const managementRouter = require('./management');
router.use('/management', managementRouter);

const questionRouter = require('./question');
router.use('/question', questionRouter);

const answerRouter = require('./answer');
router.use('/answer', answerRouter);

const mypageRouter = require('./mypage');
router.use('/mypage', mypageRouter);

const photoRouter = require('./photo');
router.use('/photo', photoRouter);

module.exports = router;
