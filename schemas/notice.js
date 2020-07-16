const mongoose = require('mongoose');
const { Schema } = mongoose;

const noticeSchema = new Schema({
    _id: Schema.Types.ObjectId,
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

    date: Date
});

module.exports = mongoose.model('Notice', noticeSchema, 'notice');