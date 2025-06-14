const express = require("express");
const router = express.Router();
const moveController = require("../controllers/move.controller");
const multer = require('multer');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 50 * 1024 * 1024 } });

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