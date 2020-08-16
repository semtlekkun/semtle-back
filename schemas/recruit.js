const mongoose = require('mongoose');
const { Schema } = mongoose;

const recruitSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    contents: {
        type: String,
        required: true
    },
    endDate: String, 
    recruitment: { 
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
    date: String
}, { versionKey: false }); 

module.exports = mongoose.model('Recruit', recruitSchema, 'recruit');