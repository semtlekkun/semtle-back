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
    teamLeaderCode:Number,
    projectImage:Array,
    view:Number,
    writer:{
        type:String,
        required:true,
        ref:"Student"
    },
    date:{
        type:String,
        required:true
    }
},
{
    versionKey:false
});

module.exports = mongoose.model("Portfolio",portfolioSchema,"portfolio");