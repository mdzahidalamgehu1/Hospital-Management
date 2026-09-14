const express = require("express");

const {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getMyProfile,
  updateMyProfile,
} = require("../controllers/patientController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// ADMIN - CREATE PATIENT
// ==========================================
router.post(
  "/",
  protect,
  authorize("admin"),
  createPatient
);

// ==========================================
// PATIENT - OWN PROFILE
// IMPORTANT: /me MUST COME BEFORE /:id
// ==========================================
router.get(
  "/me",
  protect,
  authorize("patient"),
  getMyProfile
);

router.put(
  "/me",
  protect,
  authorize("patient"),
  updateMyProfile
);

// ==========================================
// ADMIN + DOCTOR - GET ALL PATIENTS
// ==========================================
router.get(
  "/",
  protect,
  authorize("admin", "doctor"),
  getAllPatients
);

// ==========================================
// ADMIN + DOCTOR - GET SINGLE PATIENT
// ==========================================
router.get(
  "/:id",
  protect,
  authorize("admin", "doctor"),
  getPatientById
);

// ==========================================
// ADMIN + DOCTOR - UPDATE PATIENT
// ==========================================
router.put(
  "/:id",
  protect,
  authorize("admin", "doctor"),
  updatePatient
);

// ==========================================
// ADMIN + DOCTOR - DELETE PATIENT
// ==========================================
router.delete(
  "/:id",
  protect,
  authorize("admin", "doctor"),
  deletePatient
);

module.exports = router;