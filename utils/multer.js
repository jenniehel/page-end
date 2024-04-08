// multerConfig.js
//  調用multer 存圖片   
//  預先將圖片存入storage中做好 
//   然後把剛剛的storage存在變數當作middleware
const multer = require('multer');
const path = require('path'); 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, path.join(__dirname, '../public/images'))
    },
    filename: function (req, file, cb) {
        return cb(null, Date.now() + file.originalname);
    }
  })

const upload = multer({ storage: storage });

module.exports = upload;