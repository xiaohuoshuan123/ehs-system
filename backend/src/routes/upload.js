// 文件上传接口
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { auth, ok, fail } = require('../utils/common');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

router.post('/', auth, upload.single('file'), (req, res) => {
  if (!req.file) return fail(res, '未提供文件');
  const fileUrl = `/uploads/${req.file.filename}`;
  ok(res, { fileUrl, originalName: req.file.originalname, size: req.file.size }, '上传成功');
});

module.exports = router;
