const mongoose = require('mongoose');
const { Schema } = mongoose;

const photoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    contents: {
        type: String,
        required: true
    },
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
    date: String,
    image: {
        type: String,
        default: null
    },
}, { versionKey: false });

module.exports = mongoose.model('Photo', photoSchema);