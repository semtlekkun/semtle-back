const mongoose = require('mongoose');
const {Schema} = mongoose;

const portfolioSchema = new Schema({
    projectTitle:{
        type:String,
        required:true
    },
    students:{
        type:Array,
        required:true,
        ref:"Student"
    },
    contents:String,
    link:String,
    projectStartDate:String,
    prijectEndDate:String,
    projectTeamName:String,
    teamLeaderCode:String,
    projectImages:Array,
    view:Number,
    writer:{
        type:String,
        required:true
    },
    date:Date,
    studentInfo:Array
},
{
    versionKey:false
});

module.exports = mongoose.model("Portfolio",portfolioSchema,"portfolio");