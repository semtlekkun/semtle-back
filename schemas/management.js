const mongoose = require('mongoose');
const { Schema } = mongoose;

const managementSchema = new Schema({
    season:{
        type:String,
        required:true
    },
    studentCode:{
        type:Number,
        required:true
    },
    contents:String
}, { versionKey: false });

module.exports = mongoose.model('Management', managementSchema, 'management');