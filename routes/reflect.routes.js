const express = require("express");
const router = express.Router();
const reflectController = require("../controllers/reflect.controller");

router.get("/", reflectController.getAllReflectActivities);
router.get("/:id", reflectController.getReflectActivityById);
router.post("/", reflectController.createReflectActivity);
router.put("/:id", reflectController.updateReflectActivity);
router.delete("/:id", reflectController.deleteReflectActivity);

module.exports = router;