const Move = require("../models/move.model");

// Get all Move activities
exports.getAllMoveActivities = async (req, res) => {
  try {
    const moveActivities = await Move.find();
    res.json(moveActivities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single Move activity by ID
exports.getMoveActivityById = async (req, res) => {
  try {
    const moveActivity = await Move.findById(req.params.id);
    if (!moveActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json(moveActivity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new Move activity
exports.createMoveActivity = async (req, res) => {
  try {
    const { title, description, videoUrl, imagePlaceholder } = req.body;
    const newMoveActivity = new Move({ title, description, videoUrl, imagePlaceholder });
    await newMoveActivity.save();
    res.redirect("/activities/move");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a Move activity by ID
exports.updateMoveActivity = async (req, res) => {
  try {
    const updatedActivity = await Move.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json(updatedActivity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a Move activity by ID
exports.deleteMoveActivity = async (req, res) => {
  try {
    const deletedActivity = await Move.findByIdAndDelete(req.params.id);
    if (!deletedActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.redirect("/activities/move"); // Redirect to the activities page after deletion
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};