const Calm = require("../models/calm.model");

// Get all Calm activities
exports.getAllCalmActivities = async (req, res) => {
  try {
    const calmActivities = await Calm.find();
    res.json(calmActivities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single Calm activity by ID
exports.getCalmActivityById = async (req, res) => {
  try {
    const calmActivity = await Calm.findById(req.params.id);
    if (!calmActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json(calmActivity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new Calm activity
exports.createCalmActivity = async (req, res) => {
  try {
    const { title, description, summary, url } = req.body;
	
	const newCalmActivity = new Calm({ title, description, summary, url });
    await newCalmActivity.save();

	res.redirect("/activities/calm");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a Calm activity by ID
exports.updateCalmActivity = async (req, res) => {
  try {
    const updatedActivity = await Calm.findByIdAndUpdate(
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

// Delete a Calm activity by ID
exports.deleteCalmActivity = async (req, res) => {
  try {
    const deletedActivity = await Calm.findByIdAndDelete(req.params.id);
    if (!deletedActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json({ message: "Activity deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update the isWatched field of a Calm activity by ID
exports.updateIsWatched = async (req, res) => {
  try {
    const updatedActivity = await Calm.findByIdAndUpdate(
      req.params.id,
      { isWatched: req.body.isWatched },
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