const express = require("express");
const router = express.Router();
const calmController = require("../controllers/calm.controller");

router.get("/", calmController.getAllCalmActivities);
router.get("/:id", calmController.getCalmActivityById);
router.post("/", calmController.createCalmActivity);
router.put("/update/:id", calmController.updateCalmActivity);
router.delete("/delete/:id", calmController.deleteCalmActivity);

module.exports = router;
