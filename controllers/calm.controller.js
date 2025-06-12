const Calm = require("../models/calm.model");
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

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
    const { title, description, summary } = req.body;
    let url = '';
    
    if (req.file) {
      // Upload file to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto"
      });
      url = result.secure_url;
      // Remove file from local uploads folder
      fs.unlinkSync(req.file.path);
    }

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
    const { title, description, summary } = req.body;
    let updateData = { title, description, summary };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto"
      });
      updateData.url = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const updatedActivity = await Calm.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Always respond with JSON
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
