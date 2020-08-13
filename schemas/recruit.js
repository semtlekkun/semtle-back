const mongoose = require('mongoose');
const { Schema } = mongoose;

const recruitSchema = new Schema({
    //_id: Schema.Types.ObjectId, //따로 선언하지 않아도 자동으로 set 
    title: {
        type: String,
        required: true
    },
    contents: {
        type: String,
        required: true
    },
    //endDate: Number,
    endDate: String, //test를 위해 Number로 대체 
    recruitment: { //모집인원
        type: Number,
        required: true
    },
    view: {
        type: Number,
        required: false
    },
    writer: {
        type: String,
        required: true
    },
    date: Date
    //date: Number,

}, { versionKey: false }); //"__v"필드를 안보이게 하려고 

module.exports = mongoose.model('Recruit', recruitSchema, 'recruit');