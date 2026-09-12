const Department = require("../models/Department");


console.log("department type: ", typeof Department)
console.log("department create: ", typeof Department.create)

// Create Department
const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Department name is required",
      });
    }

    const department = await Department.create({
      name,
      description,
    });

    res.status(201).json({
      message: "Department created successfully",
      department,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Department
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    res.status(200).json({
      message: "Department fetched successfully",
      department,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Department
const updateDepartment = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    res.status(200).json({
      message: "Department updated successfully",
      department,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Department
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    res.status(200).json({
      message: "Department deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createDepartment,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};
