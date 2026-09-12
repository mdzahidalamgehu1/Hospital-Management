const express = require("express");

const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointmentController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Create Appointment
router.post(
  "/",
  protect,
  authorize("admin", "doctor", "patient"),
  createAppointment
);

// Get All Appointments
router.get(
  "/",
  protect,
  authorize("admin", "doctor"),
  getAllAppointments
);

// Get Single Appointment
router.get(
  "/:id",
  protect,
  authorize("admin", "doctor", "patient"),
  getAppointmentById
);

// Update Appointment
router.put(
  "/:id",
  protect,
  authorize("admin", "doctor"),
  updateAppointment
);

// Delete Appointment
router.delete(
  "/:id",
  protect,
  authorize("admin", "doctor"),
  deleteAppointment
);

module.exports = router;