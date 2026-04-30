import multer, { type FileFilterCallback } from 'multer';
import type { Request } from 'express';
import ApiError from '../utils/api-error.js';
import { StatusCode } from '../utils/api-response.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowed = ['image/png', 'image/jpeg', 'image/jpg'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(StatusCode.BAD_REQUEST, `Invalid file type. Supported types: ${allowed.join(', ')}`));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
