const mongoose = require('mongoose');
const { Schema } = mongoose;
const saltRounds = require("../config/hash").saltRounds;
const bcrypt = require("bcrypt");
const studentSchema = new Schema({
    //_id: Schema.Types.ObjectId, //따로 선언하지 않아도 자동으로 set 
    _id:{
        type:Number,
        required:true
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

studentSchema.pre('save',function(next){
    const user = this;
    bcrypt.hash(user.pw, saltRounds, function (err, hash) {
        // Store hash in your password DB.
        if (err){
            console.log(err);
            res.json({status:"error"});
        }
        user.pw = hash;
        next();
    });
})

module.exports = mongoose.model('Student', studentSchema, 'student');