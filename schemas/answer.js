const mongoose = require('mongoose');
const { Schema } = mongoose;

const answerSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        index: true,
        require: true,
        auto: true
    },
    question: {
        type: Schema.Types.ObjectId,
        require: true
    },
    contents: {
        type: String,
        required: true
    },
    writer: {
        type: String,
        required: true
    },
    date: Date,
});

module.exports = mongoose.model('Answer', answerSchema, 'answer');