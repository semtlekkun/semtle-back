const mongoose = require('mongoose');
const {Schema} = mongoose;

const questionSchema = new Schema({
    _id:Schema.Types.ObjectId,
    title:{
        type:String,
        required:true
    },
    contents:{
        type:String,
        required:true
    },
    writer:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        default:""
    },
    date:Date
});

module.exports = mongoose.model('Question',questionSchema,'question');