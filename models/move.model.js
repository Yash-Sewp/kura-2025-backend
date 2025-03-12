const mongoose = require("mongoose");

const MoveSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String
	},
	videoUrl: {
		type: String,
		required: true
	},
  imagePlaceholder: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Move", MoveSchema);