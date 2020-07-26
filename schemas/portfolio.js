const mongoose = require('mongoose');
const {Schema} = mongoose;

const portfolioSchma = new Schema({
    projectTitle:{
        type:String,
        required:ture
    },
    students:{
        type:Array,
        required:true
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
        required:true
    },
    date:{
        type:String,
        required:true
    }
},
{
    versionKey:false
});

module.exports = mongoose.model("Portfolio",portfolioSchma,"portfolio");