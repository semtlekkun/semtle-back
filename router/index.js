const express = require('express');
const router = express.Router();

const calcRouter = require('./calc');
router.use('/calc',calcRouter);
const qnaRouter = require('./QnA');
router.use('/qna',qnaRouter);


module.exports = router;
