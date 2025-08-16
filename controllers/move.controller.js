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
    console.log('=== CREATE MOVE ACTIVITY DEBUG ===');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    console.log('Content-Type:', req.get('Content-Type'));
    
    const { title, description } = req.body;
    
    console.log('Extracted title:', title);
    console.log('Extracted description:', description);
    
    // Validate required fields
    if (!title || !title.trim()) {
      console.log('Title validation failed - title:', title, 'trimmed:', title ? title.trim() : 'undefined');
      return res.status(400).json({ error: 'Title is required' });
    }
    
    let videoUrl = '';
    let imagePlaceholder = '';

    // Upload video if file provided
    if (req.files && req.files.videoFile && req.files.videoFile[0]) {
      try {
        console.log('Uploading video file:', req.files.videoFile[0].originalname);
        const result = await cloudinary.uploader.upload(req.files.videoFile[0].path, { resource_type: "video" });
        videoUrl = result.secure_url;
        fs.unlinkSync(req.files.videoFile[0].path);
        console.log('Video uploaded successfully:', videoUrl);
      } catch (uploadError) {
        console.error('Video upload error:', uploadError);
        return res.status(400).json({ error: 'Failed to upload video file' });
      }
    }

    // Upload image if file provided
    if (req.files && req.files.imageFile && req.files.imageFile[0]) {
      try {
        console.log('Uploading image file:', req.files.imageFile[0].originalname);
        const result = await cloudinary.uploader.upload(req.files.imageFile[0].path, { resource_type: "image" });
        imagePlaceholder = result.secure_url;
        fs.unlinkSync(req.files.imageFile[0].path);
        console.log('Image uploaded successfully:', imagePlaceholder);
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(400).json({ error: 'Failed to upload image file' });
      }
    }

    const newMoveActivity = new Move({ 
      title: title.trim(), 
      description: description ? description.trim() : '', 
      videoUrl, 
      imagePlaceholder 
    });
    
    console.log('Move activity object to save:', newMoveActivity);
    
    await newMoveActivity.save();
    console.log('Move activity created successfully:', newMoveActivity);
    res.status(201).json(newMoveActivity);
  } catch (err) {
    console.error('Create move activity error:', err);
    res.status(500).json({ error: 'Failed to create move activity', message: err.message });
  }
};

// Update a Move activity by ID
exports.updateMoveActivity = async (req, res) => {
  try {
    console.log('=== UPDATE MOVE ACTIVITY DEBUG ===');
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    let { title, description } = req.body;
    let updateData = { title, description };

    // Handle video upload
    if (req.files && req.files.videoFile && req.files.videoFile[0]) {
      try {
        console.log('Uploading new video file:', req.files.videoFile[0].originalname);
        const result = await cloudinary.uploader.upload(req.files.videoFile[0].path, { resource_type: "video" });
        updateData.videoUrl = result.secure_url;
        fs.unlinkSync(req.files.videoFile[0].path);
        console.log('New video uploaded successfully:', updateData.videoUrl);
      } catch (uploadError) {
        console.error('Video upload error:', uploadError);
        return res.status(400).json({ error: 'Failed to upload video file', message: uploadError.message });
      }
    } else if (req.body.videoUrl) {
      updateData.videoUrl = req.body.videoUrl;
      console.log('Keeping existing video URL:', updateData.videoUrl);
    }

    // Handle image upload
    if (req.files && req.files.imageFile && req.files.imageFile[0]) {
      try {
        console.log('Uploading new image file:', req.files.imageFile[0].originalname);
        const result = await cloudinary.uploader.upload(req.files.imageFile[0].path, { resource_type: "image" });
        updateData.imagePlaceholder = result.secure_url;
        fs.unlinkSync(req.files.imageFile[0].path);
        console.log('New image uploaded successfully:', updateData.imagePlaceholder);
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(400).json({ error: 'Failed to upload image file', message: uploadError.message });
      }
    } else if (req.body.imagePlaceholder) {
      updateData.imagePlaceholder = req.body.imagePlaceholder;
      console.log('Keeping existing image URL:', updateData.imagePlaceholder);
    }

    console.log('Final update data:', updateData);

    const updatedActivity = await Move.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedActivity) {
      console.log('Activity not found with ID:', req.params.id);
      return res.status(404).json({ message: "Activity not found" });
    }
    
    console.log('Activity updated successfully:', updatedActivity);
    res.json(updatedActivity);
  } catch (err) {
    console.error('Update move activity error:', err);
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        message: err.message 
      });
    } else if (err.name === 'CastError') {
      return res.status(400).json({ 
        error: 'Invalid ID format', 
        message: 'The provided activity ID is not valid' 
      });
    } else {
      return res.status(500).json({ 
        error: 'Server error', 
        message: err.message 
      });
    }
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