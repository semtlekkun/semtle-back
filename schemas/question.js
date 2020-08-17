const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title must be included'],
        trim: true
    },
    contents: {
        type: String,
        required: [true, 'content must be included']
    },
    image: {
        type:String
    },
    writer: {
        type: String,
        required: [true, 'writer must be included']
    },
    writerImage:{
        type:String
    },
    date: String
},
    {
        versionKey: false

    }
);

questionSchema.statics.create = function (payload) {
    const question = new this(payload);
    return question.save();
}

questionSchema.statics.findAll = function () {
    return this.find({});
}

questionSchema.statics.findOneByQuestionId = function (_id) {
    return (this.findOneAndUpdate({_id:_id}));
}

questionSchema.statics.updateByQuestionId = function (_id, payload) {
    return this.findOneAndUpdate({ _id }, payload, { new: true });
}

questionSchema.statics.deleteByQuestionId = function (_id) {
    return (this.findOneAndRemove({_id}));
}

module.exports = mongoose.model('Question', questionSchema, 'question');