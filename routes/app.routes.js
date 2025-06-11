const calmRoutes = require("./calm.routes");
const moveRoutes = require("./move.routes");
const learnRoutes = require("./learn.routes");
const reflectRoutes = require("./reflect.routes");
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

module.exports = (app) => {

  app.get("/", authMiddleware, async (req, res) => {
    try {
      const Calm = require("../models/calm.model");
      const Move = require("../models/move.model");
      const Learn = require("../models/learn.model");
      const Reflect = require("../models/reflect.model");

      const latestCalmActivities = await Calm.find().sort({ createdAt: -1 }).limit(3);
      const latestMoveActivities = await Move.find().sort({ createdAt: -1 }).limit(3);
      const latestLearnActivities = await Learn.find().sort({ createdAt: -1 }).limit(3);
      const latestReflectActivities = await Reflect.find().sort({ createdAt: -1 }).limit(3);

      res.render("home.njk", {
        latestCalmActivities,
        latestMoveActivities,
        latestLearnActivities,
        latestReflectActivities
      });
    } catch (err) {
      console.error(err);
      res.render("home.njk", {
        latestCalmActivities: [],
        latestMoveActivities: [],
        latestLearnActivities: [],
        latestReflectActivities: []
      });
    }
  });

  // Login routes
  app.get('/login', async (req, res) => {
    res.render('login.njk');
  });
  app.post('/login', authController.login);
  // app.get('/logout', authController.logout);

  // API Routes (excluded from authentication)
  app.use("/api/calm", calmRoutes);
  app.use("/api/move", moveRoutes);
  app.use("/api/learn", learnRoutes);
  app.use("/api/reflect", reflectRoutes);

  // Middleware to protect routes
  app.use(authMiddleware);

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

  app.get("/activities/calm/edit/:id", async (req, res) => {
    try {
      const Calm = require("../models/calm.model"); // Import Calm model
      const calmActivity = await Calm.findById(req.params.id); // Fetch activity by ID from MongoDB
      if (!calmActivity) {
        return res.status(404).send("Activity not found");
      }
      res.render("activities/calm/edit.njk", { calmActivity });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading activity");
    }
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

  app.get("/activities/move/edit/:id", async (req, res) => {
    try {
      const Move = require("../models/move.model"); // Import Move model
      const moveActivity = await Move.findById(req.params.id); // Fetch activity by ID from MongoDB
      if (!moveActivity) {
        return res.status(404).send("Activity not found");
      }
      res.render("activities/move/edit.njk", { moveActivity });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading activity");
    }
  });

  app.get("/activities/learn", async (req, res) => {
    try {
      const Learn = require("../models/learn.model"); // Import Learn model
      const learnActivities = await Learn.find(); // Fetch activities from MongoDB
      res.render("activities/learn/index.njk", { learnActivities });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading activities");
    }
  });

  app.get("/activities/learn/create", (req, res) => {
    res.render("activities/learn/create.njk");
  });

  app.get("/activities/learn/edit/:id", async (req, res) => {
    try {
      const Learn = require("../models/learn.model"); // Import Learn model
      const learnActivity = await Learn.findById(req.params.id); // Fetch activity by ID from MongoDB
      if (!learnActivity) {
        return res.status(404).send("Activity not found");
      }
      res.render("activities/learn/edit.njk", { learnActivity });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading activity");
    }
  });

  app.get("/activities/reflect", async (req, res) => {
    try {
      const Reflect = require("../models/reflect.model"); // Import Reflect model
      const reflectActivities = await Reflect.find(); // Fetch activities from MongoDB
      res.render("activities/reflect/index.njk", { reflectActivities });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading activities");
    }
  });

  app.get("/activities/reflect/create", (req, res) => {
    res.render("activities/reflect/create.njk");
  });

};