const mongoose = require("mongoose");

const ReflectSchema = new mongoose.Schema({
  title: {
		type: String,
		required: true,
	},
	description: {
		type: String
	}
});

module.exports = mongoose.model("Reflect", ReflectSchema);