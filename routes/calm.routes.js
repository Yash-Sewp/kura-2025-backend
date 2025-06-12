const express = require("express");
const router = express.Router();
const calmController = require("../controllers/calm.controller");
const multer = require('multer');
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB limit
});

router.get("/", calmController.getAllCalmActivities);
router.get("/:id", calmController.getCalmActivityById);
router.post('/', upload.single('url'), calmController.createCalmActivity);
router.put("/update/:id", upload.single('resourceFile'), calmController.updateCalmActivity);
router.delete("/delete/:id", calmController.deleteCalmActivity);

module.exports = router;
