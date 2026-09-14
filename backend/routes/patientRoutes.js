const express = require("express");
const {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getMyProfile,
  updateMyProfile
} = require("../controllers/patientController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, authorize("admin"), createPatient);
router.get("/", protect, authorize("admin", "doctor"), getAllPatients);
router.get("/:id", protect, authorize("admin", "doctor"), getPatientById);
router.get("/me", protect, authorize("patient"), getMyProfile);
router.put("/me", protect, authorize("patient"), updateMyProfile);
router.put("/:id", protect, authorize("admin", "doctor"), updatePatient);
router.delete("/:id", protect, authorize("admin", "doctor"), deletePatient);

module.exports = router;