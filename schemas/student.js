const mongoose = require('mongoose');
const { Schema } = mongoose;
const saltRounds = require("../config/hash").saltRounds;
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const studentSchema = new Schema({
    //_id: Schema.Types.ObjectId, //따로 선언하지 않아도 자동으로 set 
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
    }
}, { versionKey: false }); //"__v"필드를 안보이게 하려고 

studentSchema.pre('save', function (next) {
    const user = this;
    const cipher = crypto.createCipher('aes-256-cbc', 'yooncastle');
    let result = cipher.update(user.phoneNum, 'utf8', 'base64'); // 'HbMtmFdroLU0arLpMflQ'
    result += cipher.final('base64'); // 'HbMtmFdroLU0arLpMflQYtt8xEf4lrPn5tX5k+a8Nzw='
    user.phoneNum = result;

    bcrypt.hash(user.pw, saltRounds, function (err, hash) {
        // Store hash in your password DB.
        if (err) {
            console.log(err);
            res.json({ status: "error" });
        }
        user.pw = hash;
        next();
    });
})

// studentSchema.pre('find', function (next) {
//     const user2 = this;
//     console.log(this._id);
//     // const decipher = crypto.createDecipher('aes-256-cbc', 'yooncastle');
//     // let result2 = decipher.update(user.phoneNum, 'base64', 'utf8'); // 암호화할문 (base64, utf8이 위의 cipher과 반대 순서입니다.)
//     // result2 += decipher.final('utf8'); // 암호화할문장 (여기도 base64대신 utf8)
//     // user.phoneNum = result2;
//     next();
// });


module.exports = mongoose.model('Student', studentSchema, 'student');