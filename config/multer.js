const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

//Set storage engine
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

function checkFileType(file, cb) {

  const fileTypes = /jpeg|jpg|png/;

  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = fileTypes.test(file.mimetype);

  if(mimeType && extName) {
    return cb(null, true);
  } else {
    cb('!img');
  }
}

//Init uploads
module.exports = upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb)
  }
}).single('profile_image')
