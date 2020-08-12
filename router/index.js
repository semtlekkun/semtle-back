const express = require('express');
const router = express.Router();

const { verifyToken } = require("./middlewares/authorization");
const { adminConfirmation } = require('./middlewares/adminConfirmation');

const loginRouter = require('./log');
router.use('/log', loginRouter);

const recruitRouter = require('./recruit');
router.use('/recruit', recruitRouter);

const noticeRouter = require('./notice');
router.use('/notice', noticeRouter);

const portfolioRouter = require("./pf");
router.use('/pf', portfolioRouter);

const studentRouter = require("./student");
router.use('/student', verifyToken, adminConfirmation, studentRouter);

const managementRouter = require('./management');
router.use('/management', managementRouter);

const questionRouter = require('./question');
router.use('/question', questionRouter);

const answerRouter = require('./answer');
router.use('/answer', answerRouter);

//const imageRouter = require('./image');
//router.use('/image', imageRouter);

module.exports = router;
