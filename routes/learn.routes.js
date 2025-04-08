const express = require("express");
const router = express.Router();
const learnController = require("../controllers/learn.controller");

router.get("/", learnController.getAllLearnActivities);
router.get("/:id", learnController.getLearnActivityById);
router.post("/", learnController.createLearnActivity);
router.put("/update/:id", learnController.updateLearnActivity);
router.delete("/delete/:id", learnController.deleteLearnActivity);

module.exports = router;