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

module.exports.imageClean = function (folder, file) {
    if(file == null) return 0;
    const filePath = path.join(folder, file);
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(err);
            return -1
        }
        fs.unlink(filePath, (err) => {
            if(err) return -1
            else return 1
        });
    })
}

module.exports.imagesClean = function(folder,files){
    if(!files.length) return 0;
    files.forEach(el => {
        const filePath = path.join(folder, el);
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.log(err);
                return -1
            }
            fs.unlink(filePath, (err) => {
                if(err) return -1
                else return 1
            });
        })
    });
}