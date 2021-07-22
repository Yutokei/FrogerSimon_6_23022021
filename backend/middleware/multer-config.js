const multer = require('multer');

//Taille maximale des images uploader 5MB
const maxSize = 5* 1024 * 10;

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
}
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension)
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: maxSize }
})

module.exports = upload.single('image');