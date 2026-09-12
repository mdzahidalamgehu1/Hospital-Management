const express = require("express");
const protect = require("../middleware/authMiddleware");
const { route } = require("./authRoutes");

const router = express.Router();

router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "You are authenticated",
    user: req.user
  });
});

module.exports = router;