const mongoose = require('mongoose');
const { Schema } = mongoose;
const saltRounds = require("../config/hash").saltRounds;
const bcrypt = require("bcrypt");
const studentSchema = new Schema({
    _id:{
        type:String,
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
}, { versionKey: false }); 
studentSchema.pre('save',function(next){
    const user = this;
    bcrypt.hash(user.pw, saltRounds, function (err, hash) {
        if (err){
            console.log(err);
            res.json({status:"error"});
        }
        user.pw = hash;
        next();
    });
})

// studentSchema.pre('find',function(next){
//     console.log("TEST FIND");
// })

module.exports = mongoose.model('Student', studentSchema, 'student');