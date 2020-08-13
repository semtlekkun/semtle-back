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
},
{
    versionKey:false
});

answerSchema.statics.create = function (payload) {
    const answer = new this(payload);
    return answer.save();
}

answerSchema.statics.findByQuestionId = function (question) {
    return (this.find()
        .where('question').equals(question));
}

answerSchema.statics.updateByQuestionId = function (_id, payload) {
    return this.findOneAndUpdate({ _id }, payload, { new: true });
}

answerSchema.statics.deleteByAnswerId = function (_id) {
    return (this.remove()
        .where('_id').equals(_id));
}

module.exports = mongoose.model('answer', answerSchema);