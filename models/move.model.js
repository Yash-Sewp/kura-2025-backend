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
		required: false
	},
  imagePlaceholder: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model("Move", MoveSchema);