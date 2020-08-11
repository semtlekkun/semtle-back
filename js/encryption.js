const key = require("../config/key").secret;
const crypto = require('crypto');

const passCipher = crypto.createCipher('aes-256-ccm')