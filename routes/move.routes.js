const express = require("express");
const router = express.Router();
const moveController = require("../controllers/move.controller");

router.get("/", moveController.getAllMoveActivities);
router.get("/:id", moveController.getMoveActivityById);
router.post("/", moveController.createMoveActivity);
router.put("/:id", moveController.updateMoveActivity);
router.delete("/delete/:id", moveController.deleteMoveActivity);

module.exports = router;