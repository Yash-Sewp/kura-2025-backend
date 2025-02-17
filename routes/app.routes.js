const calmRoutes = require("./calm.routes");

module.exports = (app) => {
  
  app.get("/", (req, res) => {
    res.render("home");
  });

  // Pages
  app.get("/activities/calm", async (req, res) => {
    try {
      const Calm = require("../models/calm.model"); // Import Calm model
      const calmActivities = await Calm.find(); // Fetch activities from MongoDB
      res.render("activities/calm/index", { calmActivities });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading activities");
    }
  });

  app.get("/activities/calm/create", (req, res) => {
    res.render("activities/calm/create");
  });

  // API Routes
  app.use("/api/calm", calmRoutes);
};