const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { User } = require("../models/User");

const router = express.Router();

router.get("/dashboard", protect, authorize("admin"), (req, res) => {
  res.json({message: "Welcome to admin Dashboard",
    user: req.user
  });
});

module.exports = router;