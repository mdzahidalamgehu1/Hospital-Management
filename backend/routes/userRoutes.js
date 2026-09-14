const express = require("express");
const protect = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

router.get("/profile", protect, (req, res) => {
  User.findById(req.user.id)
    .select("name email role")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ user });
    })
    .catch(() => res.status(500).json({ message: "Failed to load profile" }));
});

module.exports = router;