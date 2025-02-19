const mongoose = require("mongoose");

const CalmSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String
	},
	summary: {
		type: String
	},
	url: {
		type: String,
    	required: true
	},
	isWatched: {
		type: Boolean,
		default: false
	},
});

module.exports = mongoose.model("Calm", CalmSchema);