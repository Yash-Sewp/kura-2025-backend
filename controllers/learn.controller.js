const Learn = require("../models/learn.model");
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

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
    const { title, subTitle, instructor, description, communityScore } = req.body;
    let featureImageUrl = req.body.featureImage;
    let videos = [];
    let audios = [];

    // Upload feature image if file provided
    if (req.files && req.files.featureImage && req.files.featureImage[0]) {
      const result = await cloudinary.uploader.upload(req.files.featureImage[0].path, { resource_type: "image" });
      featureImageUrl = result.secure_url;
      fs.unlinkSync(req.files.featureImage[0].path);
    }

    // Upload videos if files provided
    if (req.files && req.files.videoFiles && req.body.videoTitles) {
      const titles = Array.isArray(req.body.videoTitles) ? req.body.videoTitles : [req.body.videoTitles];
      const files = req.files.videoFiles || [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const title = titles[i] || '';
        const result = await cloudinary.uploader.upload(file.path, { resource_type: "video" });
        videos.push({ title, url: result.secure_url });
        fs.unlinkSync(file.path);
      }
    } else if (req.body.videos) {
      // If videos are provided as URLs (not files)
      videos = Array.isArray(req.body.videos) ? req.body.videos : [req.body.videos];
    }

    // Upload audios if files provided
    if (req.files && req.files.audioFiles && req.body.audioTitles) {
      const titles = Array.isArray(req.body.audioTitles) ? req.body.audioTitles : [req.body.audioTitles];
      const files = req.files.audioFiles || [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const title = titles[i] || '';
        const result = await cloudinary.uploader.upload(file.path, { resource_type: "auto" });
        audios.push({ title, url: result.secure_url });
        fs.unlinkSync(file.path);
      }
    } else if (req.body.audios) {
      audios = Array.isArray(req.body.audios) ? req.body.audios : [req.body.audios];
    }

    const newLearnActivity = new Learn({
      title,
      subTitle,
      instructor,
      featureImage: featureImageUrl,
      description,
      communityScore,
      videos,
      audios
    });

    await newLearnActivity.save();
    res.json(newLearnActivity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a Learn activity by ID
exports.updateLearnActivity = async (req, res) => {
  try {
    const { title, subTitle, instructor, description, communityScore } = req.body;
    let updateData = { title, subTitle, instructor, description, communityScore };

    // Handle featureImage upload
    if (req.files && req.files.featureImage && req.files.featureImage[0]) {
      const result = await cloudinary.uploader.upload(req.files.featureImage[0].path, { resource_type: "image" });
      updateData.featureImage = result.secure_url;
      fs.unlinkSync(req.files.featureImage[0].path);
    }

    // Handle videos upload
    // Parse existing videos from hidden fields
    let videos = [];
    if (req.body.existingVideos) {
      const existing = Array.isArray(req.body.existingVideos) ? req.body.existingVideos : [req.body.existingVideos];
      existing.forEach(v => videos.push(JSON.parse(v)));
    }

    // Handle new video uploads
    if (req.body.videoTitles && req.files && req.files.videoFiles) {
      const titles = Array.isArray(req.body.videoTitles) ? req.body.videoTitles : [req.body.videoTitles];
      const files = req.files.videoFiles || [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const title = titles[i] || '';
        const result = await cloudinary.uploader.upload(file.path, { resource_type: "video" });
        videos.push({ title, url: result.secure_url });
        fs.unlinkSync(file.path);
      }
    }

    // Handle audios upload
    let audios = [];

    // Parse existing audios from hidden fields
    if (req.body.existingAudios) {
      const existing = Array.isArray(req.body.existingAudios) ? req.body.existingAudios : [req.body.existingAudios];
      existing.forEach(a => audios.push(JSON.parse(a)));
    }

    // Handle new audio uploads
    if (req.body.audioTitles && req.files && req.files.audioFiles) {
      const titles = Array.isArray(req.body.audioTitles) ? req.body.audioTitles : [req.body.audioTitles];
      const files = req.files.audioFiles || [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const title = titles[i] || '';
        const result = await cloudinary.uploader.upload(file.path, { resource_type: "auto" });
        audios.push({ title, url: result.secure_url });
        fs.unlinkSync(file.path);
      }
    } else if (req.body.audios) {
      // If audios are provided as URLs (not files)
      audios = audios.concat(Array.isArray(req.body.audios) ? req.body.audios : [req.body.audios]);
    }

    const updatedActivity = await Learn.findByIdAndUpdate(
      req.params.id,
      { ...updateData, videos, audios },
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