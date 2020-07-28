const express = require('express');
const router = express.Router();

const calcRouter = require('./calc');
router.use('/calc',calcRouter);
const qnaRouter = require('./QnA');
router.use('/qna',qnaRouter);
const loginRouter = require('./login');
router.use('/login',loginRouter);


module.exports = router;
