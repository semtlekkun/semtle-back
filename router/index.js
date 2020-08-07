const express = require('express');
const router = express.Router();

const questionRouter = require('./question');
router.use('/question', questionRouter);
//const answerRouter = require('./answer');
//router.use('/answer', answerRouter);

module.exports = router;
