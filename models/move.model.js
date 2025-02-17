const mongoose = require("mongoose");

const MoveSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String
	},
	url: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model("Move", MoveSchema);