const mongoose = require('mongoose');
const {Schema} = mongoose;

const adminSchema = new Schema({
    _id:{
        type:String,
        required:true
    },
    pw:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    nick:{
        type:String,
        required:true
    },
    phoneNum:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:"default.jpg"
    }
},
{
    versionKey:false
});

module.exports = mongoose.model("Admin",adminSchema,"admin");