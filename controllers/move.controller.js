const Move = require("../models/move.model");
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

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

    let { title, description } = req.body;
    let videoUrl = req.body.videoFile;
    let imagePlaceholder = req.body.imageFile;

    // Upload video if file provided
    if (req.files && req.files.videoFile && req.files.videoFile[0]) {
      const result = await cloudinary.uploader.upload(req.files.videoFile[0].path, { resource_type: "video" });
      videoUrl = result.secure_url;
      fs.unlinkSync(req.files.videoFile[0].path);
    }

    // Upload image if file provided
    if (req.files && req.files.imageFile && req.files.imageFile[0]) {
      const result = await cloudinary.uploader.upload(req.files.imageFile[0].path, { resource_type: "image" });
      imagePlaceholder = result.secure_url;
      fs.unlinkSync(req.files.imageFile[0].path);
    }

    const newMoveActivity = new Move({ title, description, videoUrl, imagePlaceholder });
    await newMoveActivity.save();
    res.json(newMoveActivity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a Move activity by ID
exports.updateMoveActivity = async (req, res) => {
  try {
    let { title, description } = req.body;
    let updateData = { title, description };

    // Handle video upload
    if (req.files && req.files.videoFile && req.files.videoFile[0]) {
      const result = await cloudinary.uploader.upload(req.files.videoFile[0].path, { resource_type: "video" });
      updateData.videoUrl = result.secure_url;
      fs.unlinkSync(req.files.videoFile[0].path);
    } else if (req.body.videoUrl) {
      updateData.videoUrl = req.body.videoUrl;
    }

    // Handle image upload
    if (req.files && req.files.imageFile && req.files.imageFile[0]) {
      const result = await cloudinary.uploader.upload(req.files.imageFile[0].path, { resource_type: "image" });
      updateData.imagePlaceholder = result.secure_url;
      fs.unlinkSync(req.files.imageFile[0].path);
    } else if (req.body.imagePlaceholder) {
      updateData.imagePlaceholder = req.body.imagePlaceholder;
    }

    const updatedActivity = await Move.findByIdAndUpdate(
      req.params.id,
      updateData,
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

// Render the Edit Move Activity page
exports.renderEditMoveActivityPage = async (req, res) => {
  try {
    const moveActivity = await Move.findById(req.params.id);
    if (!moveActivity) {
      return res.status(404).send("Activity not found");
    }
    res.render("activities/move/edit", { moveActivity });
  } catch (err) {
    res.status(500).send("Server error");
  }
};