const express = require("express");
const router = express.Router();
const moveController = require("../controllers/move.controller");
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { 
    fileSize: 50 * 1024 * 1024 // 50MB max (for videos)
  },
  fileFilter: (req, file, cb) => {
    // Apply different size limits based on field name
    if (file.fieldname === 'imageFile' && file.size > 10 * 1024 * 1024) {
      // 10MB limit for images
      cb(new Error('Image file too large. Maximum size is 10MB.'), false);
    } else if (file.fieldname === 'videoFile' && file.size > 50 * 1024 * 1024) {
      // 50MB limit for videos
      cb(new Error('Video file too large. Maximum size is 50MB.'), false);
    } else {
      cb(null, true);
    }
  }
});

router.get("/", moveController.getAllMoveActivities);
router.get("/:id", moveController.getMoveActivityById);
router.post('/', upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'imageFile', maxCount: 1 }
]), moveController.createMoveActivity);

router.put('/update/:id', upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'imageFile', maxCount: 1 }
]), moveController.updateMoveActivity);
router.delete("/delete/:id", moveController.deleteMoveActivity);

module.exports = router;