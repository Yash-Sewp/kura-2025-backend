const calmRoutes = require("./calm.routes");
const moveRoutes = require("./move.routes");
const learnRoutes = require("./learn.routes");

module.exports = (app) => {
  
  app.get("/", (req, res) => {
    res.render("home.njk");
  });

  // Pages
  app.get("/activities/calm", async (req, res) => {
    try {
      const Calm = require("../models/calm.model"); // Import Calm model
      const calmActivities = await Calm.find(); // Fetch activities from MongoDB
      res.render("activities/calm/index.njk", { calmActivities });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading activities");
    }
  });

  app.get("/activities/calm/create", (req, res) => {
    res.render("activities/calm/create.njk");
  });

  app.get("/activities/move", async (req, res) => {
    try {
      const Move = require("../models/move.model"); // Import Move model
      const moveActivities = await Move.find(); // Fetch activities from MongoDB
      res.render("activities/move/index.njk", { moveActivities });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading activities");
    }
  });

  app.get("/activities/move/create", (req, res) => {
    res.render("activities/move/create.njk");
  });

  // API Routes
  app.use("/api/calm", calmRoutes);
  app.use("/api/move", moveRoutes);
  app.use("/api/learn", learnRoutes);
};