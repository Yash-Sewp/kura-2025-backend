const express = require("express");
const router = express.Router();
const learnController = require("../controllers/learn.controller");
const multer = require('multer');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 50 * 1024 * 1024 } });

router.get("/", learnController.getAllLearnActivities);
router.get("/:id", learnController.getLearnActivityById);
router.post('/', upload.fields([
  { name: 'featureImage', maxCount: 1 },
  { name: 'videoFiles' },
  { name: 'audioFiles' }
]), learnController.createLearnActivity);

router.put('/update/:id', upload.fields([
  { name: 'featureImage', maxCount: 1 },
  { name: 'videoFiles' },
  { name: 'audioFiles' }
]), learnController.updateLearnActivity);
router.delete("/delete/:id", learnController.deleteLearnActivity);

module.exports = router;