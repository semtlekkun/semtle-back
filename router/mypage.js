const express = require('express');
const router = express.Router();
const student = require('../schemas/student');
const {verifyToken} = require('./middlewares/authorization');

router.get('/', verifyToken, (req, res) => {
    student.findOne({_id:res.locals.id},{pw:false})
        .then(student => res.send(student))
        .catch(err => res.status(500).send(err));

});

router.put('/', verifyToken, (req, res) => {
    student.findOneAndUpdate().where('_id').equals(res.locals.id)
        .then(student => res.send(student))
        .catch(err => res.status(500).send(err));
});


module.exports = router;