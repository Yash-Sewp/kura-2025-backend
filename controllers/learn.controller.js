const Learn = require("../models/learn.model");

// Get all Learn activities
exports.getAllLearnActivities = async (req, res) => {
  try {
    const learnActivities = await Learn.find();
    res.json(learnActivities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single Learn activity by ID
exports.getLearnActivityById = async (req, res) => {
  try {
    const learnActivity = await Learn.findById(req.params.id);
    if (!learnActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json(learnActivity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new Learn activity
exports.createLearnActivity = async (req, res) => {
  try {
    const { title, instructor, videos, audios } = req.body;
    const newLearnActivity = new Learn({ title, instructor, videos, audios });
    await newLearnActivity.save();
    res.redirect("/activities/learn");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a Learn activity by ID
exports.updateLearnActivity = async (req, res) => {
  try {
    const updatedActivity = await Learn.findByIdAndUpdate(
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

// Delete a Learn activity by ID
exports.deleteLearnActivity = async (req, res) => {
  try {
    const deletedActivity = await Learn.findByIdAndDelete(req.params.id);
    if (!deletedActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json({ message: "Activity deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};