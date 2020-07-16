const express = require('express');
const router = express.Router();

const calcRouter = require('./calc');
router.use('/calc', calcRouter);
const qnaRouter = require('./QnA');
router.use('/qna', qnaRouter);

const recruitRouter = require('./recruit');
router.use('/recruit', recruitRouter);

const noticeRouter = require('./notice');
router.use('/notice', noticeRouter);

module.exports = router;
