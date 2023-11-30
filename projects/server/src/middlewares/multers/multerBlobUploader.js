const multer = require('multer');
const { ResponseError } = require('../../errors');

function multerBlobUploader() {
  return multer({
    fileFilter: (req, file, cb) => {
      if (file.mimetype.split('/')[0] !== 'image')
        return cb(new ResponseError('image file invalid', 400));
      return cb(null, true);
    },
    limits: {
      fileSize: 4000000,
    },
  });
}

module.exports = multerBlobUploader;
