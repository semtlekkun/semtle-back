const mongoose = require('mongoose');
const { Schema } = mongoose;

const noticeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    contents: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ""
    },
    view: {
        type: Number,
        required: true
    },
    writer: {
        type: String,
        required: true
    },
    date: String
}, { versionKey: false });

module.exports = mongoose.model('Notice', noticeSchema, 'notice');