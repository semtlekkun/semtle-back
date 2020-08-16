const multer = require('multer');
const format = require('../../js/formatDate');
const fs = require('fs');
const path = require('path');
module.exports.imageUpload = function (path) {

    const imageStorage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, path);
        },
        filename: function (req, file, callback) {
            callback(null, format(new Date()) + '_' + file.originalname);
        }
    });

    const upload = multer({
        storage: imageStorage
    });

    return upload
}

module.exports.imageDelete = function (folder, file) {
    const filePath = path.join(__dirname, folder, file);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(err);
            return { status: "error" };
        }
        fs.unlink(filePath, (err) => {
            if(err) return {status:"error"}
            else return {status:"success"}
        });
    })
}