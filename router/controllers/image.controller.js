const multer = require('multer');
const format = require('../../js/formatDate');

module.exports.imageUpload = function(path){

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