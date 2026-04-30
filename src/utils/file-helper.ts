import fs from 'fs';

const deleteFile = (path: string) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

export default deleteFile;
