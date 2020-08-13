const mongoose = require('mongoose');
const { Schema } = mongoose;

const managementSchema = new Schema({
    season:{
        type:String,
        required:true
    },
    studentCode:{
        type:String,
        required:true
    },
    contents:String,
    language:String,
    position:String
}, { versionKey: false });

module.exports = mongoose.model('Management', managementSchema, 'management');