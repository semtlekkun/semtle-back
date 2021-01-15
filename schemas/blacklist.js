const mongoose = require('mongoose');
const { Schema } = mongoose;

const blacklistSchema = new Schema({
    token: {
        type: String,
        required: true
    }

}, { versionKey: false });

module.exports = mongoose.model('Blacklist', blacklistSchema, 'blacklist');