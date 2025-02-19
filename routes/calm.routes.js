const express = require("express");
const router = express.Router();
const calmController = require("../controllers/calm.controller");

router.get("/", calmController.getAllCalmActivities);
router.get("/:id", calmController.getCalmActivityById);
router.post("/", calmController.createCalmActivity);
router.put("/:id", calmController.updateCalmActivity);
router.delete("/:id", calmController.deleteCalmActivity);
router.patch("/:id/isWatched", calmController.updateIsWatched);

module.exports = router;
