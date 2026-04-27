const multer = require('multer');
const ApiError = require('../utils/api-error');
const { StatusCode } = require('../utils/api-response');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/png', 'image/jpeg', 'image/jpg'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(StatusCode.BAD_REQUEST, `Invalid file type. Supported types: ${allowed.join(', ')}`), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
