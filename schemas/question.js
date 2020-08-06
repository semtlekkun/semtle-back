const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        index: true,
        require: true,
        auto: true
    },
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