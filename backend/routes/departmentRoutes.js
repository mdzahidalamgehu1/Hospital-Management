const express = require("express");
const { getAllDepartments, createDepartment, getDepartmentById, updateDepartment, deleteDepartment } = require("../controllers/departmentController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, getAllDepartments);

// Create Department
router.post("/", protect, authorize("admin"), createDepartment);

// Get Department by ID
router.get("/:id", protect, getDepartmentById);

// Update Department
router.put("/:id", protect, authorize("admin"), updateDepartment);

// Delete Department
router.delete("/:id", protect, authorize("admin"), deleteDepartment);

module.exports = router;