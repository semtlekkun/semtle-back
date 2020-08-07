const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema({
    //_id: Schema.Types.ObjectId, //따로 선언하지 않아도 자동으로 set 

    _id: {
        type: Number,
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

module.exports = mongoose.model('Student', studentSchema, 'student');