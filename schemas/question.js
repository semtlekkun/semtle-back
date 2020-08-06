const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = new Schema({
    _id: Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ""
    },
    writer: {
        type: String,
        required: true
    },
    date: Date
});

module.exports = mongoose.model('Question', questionSchema, 'question');