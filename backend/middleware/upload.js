// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// // middleware/upload.js


// const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
// if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, UPLOAD_DIR);
//   },
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
//     cb(null, `${Date.now()}_${Math.round(Math.random() * 1e9)}_${base}${ext}`);
//   }
// });

// function fileFilter(req, file, cb) {
//   // accept images only
//   if (/^image\/(jpeg|png|webp|gif|jpg)$/.test(file.mimetype)) cb(null, true);
//   else cb(new Error('Only image files are allowed!'), false);
// }

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
//   fileFilter
// });

// module.exports = upload;
