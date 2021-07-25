const mongoose = require('mongoose');
const { Schema } = mongoose;
const saltRounds = require("../config/hash").saltRounds;
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const KEY = require('../config/key');


const IV_LENGTH = 16; // For AES, this is always 16
const iv = crypto.randomBytes(IV_LENGTH);


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
        Buffer.from(KEY.encryption), iv);
    var crypted = cipher.update(user.phoneNum);

    crypted = Buffer.concat([crypted, cipher.final()]);
    user.phoneNum = iv.toString('hex') + ':' + crypted.toString('hex');

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