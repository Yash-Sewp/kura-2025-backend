// Import required modules
const express = require("express");
const path = require("path");
const app = express();
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');
require('dotenv').config();

app.use(express.urlencoded({ extended: true })); // For parsing form data
app.use(express.json()); // For parsing JSON data

// Set up Nunjucks as the view engine
nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.set("view engine", "njk");

// Middleware to serve static files (Bootstrap, CSS, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Routes
require('./routes/app.routes')(app);

// Configuring the database
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kura-cms', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// Connecting to the database
mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
});
mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB successfully!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));