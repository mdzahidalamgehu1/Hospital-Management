const express = require("express");

const {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getMyDoctorProfile,
  updateMyDoctorProfile,
} = require("../controllers/doctorController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

console.log(typeof getMyDoctorProfile); // Check the type of getMyDoctorProfile);

// Create Doctor - Admin only
router.post(
  "/",
  protect,
  authorize("admin"),
  createDoctor
);

// Logged-in doctor's profile
router.get(
  "/me",
  protect,
  authorize("doctor"),
  getMyDoctorProfile
);

router.put(
  "/me",
  protect,
  authorize("doctor"),
  updateMyDoctorProfile
);


// Get All Doctors - Logged-in users
router.get(
  "/",
  protect,
  getAllDoctors
);


// Get Doctor By ID - Logged-in users
router.get(
  "/:id",
  protect,
  getDoctorById
);

// Update Doctor - Admin only
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateDoctor
);

// Delete Doctor - Admin only
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteDoctor
);

module.exports = router;