const mongoose = require('mongoose');
const { Schema } = mongoose;
const saltRounds = require("../config/hash").saltRounds;
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const studentSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    pw: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    nick: {
        type: String,
        required: true
    },
    phoneNum: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    pfList: Object
}, { versionKey: false });

studentSchema.pre('save', function (next) {
    const user = this;
    // //phoneNum Encoding
    // const cipher = crypto.createCipher('aes-256-cbc', 'yooncastle');
    // let result = cipher.update(user.phoneNum, 'utf8', 'base64'); // 'HbMtmFdroLU0arLpMflQ'
    // result += cipher.final('base64'); // 'HbMtmFdroLU0arLpMflQYtt8xEf4lrPn5tX5k+a8Nzw='
    // user.phoneNum = result;

    const cipher = crypto.createCipheriv('aes-256-cbc',
        new Buffer('yooncastle'), new Buffer('20161313'));
    var crypted = cipher.update(user.phoneNum, 'utf8', 'hex');
    crypted += cipher.final('hex')
    user.phoneNum = crypted;

    //pw Hashing
    bcrypt.hash(user.pw, saltRounds, function (err, hash) {
        if (err) {
            console.log(err);
            next(err);
        }
        user.pw = hash;
        next();
    });
})

module.exports = mongoose.model('Student', studentSchema, 'student');