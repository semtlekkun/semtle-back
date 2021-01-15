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
    },
    contents:String,
    git:String,
    link:String,
    projectStartDate:String,
    projectEndDate:String,
    projectTeamName:String,
    leaderNick:String,
    projectImages:Array,
    view:Number,
    writer:{
        type:String,
        required:true
    },
    date:String
},
{
    versionKey:false
});

module.exports = mongoose.model("Portfolio",portfolioSchema,"portfolio");