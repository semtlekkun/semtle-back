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
    contents: {
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
},
{
    versionKey:false
});

questionSchema.statics.create = function (payload) {
    const question = new this(payload);
    return question.save();
}

questionSchema.statics.findAll = function () {
    return this.find({});
}

questionSchema.statics.findOneByQuestionId = function (_id) {
    return this.findOne({ _id });
}

questionSchema.statics.updateByQuestionId = function (_id, payload) {
    return this.findOneAndUpdate({ _id }, payload, { new: true });
}

questionSchema.statics.deleteByQuestionId = function (_id) {
    return this.remove({ _id });
}

module.exports = mongoose.model('Question', questionSchema,'question');