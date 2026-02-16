import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  recognizeIngredients,
  extractIngredientsFromText
} from '../controllers/uploadController';

const router = express.Router();

// configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
  // aaccept only image filesssss
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WebP) are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter
});

// post /api/upload/recognize - upload image and recognize ingredients
router.post('/recognize', upload.single('image'), recognizeIngredients);

// post /api/upload/extract-text - extract ingredients from text
router.post('/extract-text', extractIngredientsFromText);

// error handling for multer
router.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB'
      });
    }
  }
  res.status(400).json({
    success: false,
    message: error.message || 'Error uploading file'
  });
});

export default router;