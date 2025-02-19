const Reflect = require("../models/reflect.model");

// Get all Reflect activities
exports.getAllReflectActivities = async (req, res) => {
  try {
    const reflectActivities = await Reflect.find();
    res.json(reflectActivities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single Reflect activity by ID
exports.getReflectActivityById = async (req, res) => {
  try {
    const reflectActivity = await Reflect.findById(req.params.id);
    if (!reflectActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json(reflectActivity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new Reflect activity
exports.createReflectActivity = async (req, res) => {
  try {
    const { title, description, summary, url } = req.body;
    const newReflectActivity = new Reflect({ title, description, summary, url });
    await newReflectActivity.save();
    res.redirect("/activities/reflect");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a Reflect activity by ID
exports.updateReflectActivity = async (req, res) => {
  try {
    const updatedActivity = await Reflect.findByIdAndUpdate(
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

// Delete a Reflect activity by ID
exports.deleteReflectActivity = async (req, res) => {
  try {
    const deletedActivity = await Reflect.findByIdAndDelete(req.params.id);
    if (!deletedActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json({ message: "Activity deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
