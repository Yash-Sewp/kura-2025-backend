const express = require("express");
const router = express.Router();
const calmController = require("../controllers/calm.controller");
const multer = require('multer');

// Configure multer for audio file uploads with 10MB limit
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit for audio files
  fileFilter: (req, file, cb) => {
    // Check if it's an audio file
    if (file.mimetype && file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed.'), false);
    }
  }
});

// Error handling middleware for Multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'File too large', 
        message: 'Audio file size exceeds the 10MB limit. Please choose a smaller file.' 
      });
    }
    return res.status(400).json({ 
      error: 'File upload error', 
      message: error.message 
    });
  }
  if (error.message === 'Only audio files are allowed.') {
    return res.status(400).json({ 
      error: 'Invalid file type', 
      message: 'Only audio files (MP3, etc.) are allowed.' 
    });
  }
  next(error);
};

router.get("/", calmController.getAllCalmActivities);
router.get("/:id", calmController.getCalmActivityById);
router.post('/', upload.single('url'), handleMulterError, calmController.createCalmActivity);
router.put("/update/:id", upload.single('resourceFile'), handleMulterError, calmController.updateCalmActivity);
router.delete("/delete/:id", calmController.deleteCalmActivity);

module.exports = router;
