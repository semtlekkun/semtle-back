const mongoose = require('mongoose');
const { Schema } = mongoose;


const answerSchema = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        trim: true
    },
    content: {
        type: String,
        required: [true, 'content must be included']
    },
    writer: {
        type: String,
        required: [true, 'writer must be included'],
        trim: true
    }
}, {
    timestamps: true
});

answerSchema.statics.create = function (payload) {
    const answer = new this(payload);
    return answer.save();
}

answerSchema.statics.findByQuestionId = function (question) {
    return (this.find().where('question').equals(question));
}

answerSchema.statics.updateByQuestionId = function (_id, payload) {
    return this.findOneAndUpdate({ _id }, payload, { new: true });
}

answerSchema.statics.deleteByAnswerId = function (_id) {
    return (this.remove().where('_id').equals(_id));
}

answerSchema.statics.deleteByQuestionId = function (question) {
    return (this.deleteMany().where('question').equals(question));
}

module.exports = mongoose.model('answer', answerSchema);