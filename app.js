// Import required modules
const express = require("express");
const mongoose = require('mongoose');
const path = require("path");
const app = express();
const nunjucks = require('nunjucks');
const cron = require('node-cron');
const session = require('express-session');
const axios = require('axios');

require('dotenv').config();

app.use(express.urlencoded({ extended: true })); // For parsing form data
app.use(express.json()); // For parsing JSON data

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

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

// Function to handle the API call logic
async function pingServer() {
  try {
    let url = 'https://kura-2025-backend.onrender.com/';  // Default URL for non-production environments

    // Make the GET request to the determined URL
    await axios.get(url);
    console.log(`Pinged ${url} successfully at ${new Date().toISOString()}`);
  } catch (error) {
    console.error(`Error pinging ${url}:`, error.message);
  }
}

// Initialize the cron job
function initializeCronJob() {
  if (process.env.NODE_ENV === 'production') {
    // Schedule the cron job to run every 15 minutes in production
    cron.schedule('*/15 * * * *', async () => {
      console.log('Cron job triggered for pinging the server');
      await pingServer();
    });

    console.log('Cron job for server pinging has been scheduled');
  }
}

// Call the initializeCronJob function when the app starts
initializeCronJob();

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

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('=== GLOBAL ERROR HANDLER ===');
  console.error('Error:', error);
  console.error('Request URL:', req.url);
  console.error('Request method:', req.method);
  console.error('Request body:', req.body);
  console.error('Request files:', req.files);
  
  // Handle Multer errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'File too large',
      message: 'The uploaded file exceeds the maximum allowed size.'
    });
  }
  
  // Handle other errors
  res.status(500).json({
    error: 'Internal server error',
    message: error.message || 'An unexpected error occurred'
  });
});