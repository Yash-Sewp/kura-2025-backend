const mongoose = require("mongoose");

const LearnSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
  subTitle: {
    type: String,
  },
	instructor: {
		type: String
	},
  videos: [
    {
      title: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  audios: [
    {
      title: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ]
});

module.exports = mongoose.model("Learn", LearnSchema);