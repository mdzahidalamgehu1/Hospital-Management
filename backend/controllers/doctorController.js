const Doctor = require("../models/Doctor");
const Department = require("../models/Department");
const User = require("../models/User");


// Create Doctor
const createDoctor = async (req, res) => {
  try {
    const {
      user,
      department,
      specialization,
      qualifications,
      experience,
      phone,
      consultationFee,
      availableDays,
      availableTime,
    } = req.body;

    // Check required fields
    if (
      !user ||
      !department ||
      !specialization ||
      !qualifications ||
      experience === undefined ||
      !phone ||
      consultationFee === undefined ||
      !availableDays ||
      !availableTime
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if user exists
    const existingUser = await User.findById(user);

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // User must have doctor role
    if (existingUser.role !== "doctor") {
      return res.status(400).json({
        message: "User is not a doctor",
      });
    }

    // Check if doctor profile already exists
    const existingDoctor = await Doctor.findOne({ user });

    if (existingDoctor) {
      return res.status(400).json({
        message: "Doctor already exists for this user",
      });
    }

    // Check if department exists
    const existingDepartment = await Department.findById(department);

    if (!existingDepartment) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    // Create doctor
    const createdDoctor = await Doctor.create({
      user,
      department,
      specialization,
      qualifications,
      experience,
      phone,
      consultationFee,
      availableDays,
      availableTime,
    });

    // Populate user and department
    const populatedDoctor = await Doctor.findById(createdDoctor._id)
      .populate("user", "name email role")
      .populate("department", "name description");

    res.status(201).json({
      message: "Doctor created successfully",
      doctor: populatedDoctor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate("user", "name email role")
      .populate("department", "name");

    res.status(200).json({
      message: "Doctors fetched successfully",
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Doctor By ID
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("user", "name email role")
      .populate("department", "name");

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      message: "Doctor fetched successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Doctor
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("user", "name email role")
      .populate("department", "name");

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      message: "Doctor updated successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Doctor
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Get logged-in doctor profile
const getMyDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      user: req.user.id,
    })
      .populate("user", "name email role")
      .populate("department", "name description");

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    res.status(200).json({
      doctor,
    });
  } catch (error) {
    console.error("Get doctor profile error:", error);

    res.status(500).json({
      message: "Failed to fetch doctor profile",
      error: error.message,
    });
  }
};


// Update logged-in doctor profile
const updateMyDoctorProfile = async (req, res) => {
  try {
    const {
      specialization,
      qualifications,
      experience,
      phone,
      consultationFee,
      availableDays,
      availableTime,
    } = req.body;

    const doctor = await Doctor.findOne({
      user: req.user.id,
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    if (specialization !== undefined) {
      doctor.specialization = specialization;
    }

    if (qualifications !== undefined) {
      doctor.qualifications = qualifications;
    }

    if (experience !== undefined) {
      doctor.experience = experience;
    }

    if (phone !== undefined) {
      doctor.phone = phone;
    }

    if (consultationFee !== undefined) {
      doctor.consultationFee = consultationFee;
    }

    if (availableDays !== undefined) {
      doctor.availableDays = availableDays;
    }

    if (availableTime !== undefined) {
      doctor.availableTime = availableTime;
    }

    await doctor.save();

    const updatedDoctor = await Doctor.findById(doctor._id)
      .populate("user", "name email role")
      .populate("department", "name description");

    res.status(200).json({
      message: "Doctor profile updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error("Update doctor profile error:", error);

    res.status(500).json({
      message: "Failed to update doctor profile",
      error: error.message,
    });
  }
};

module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getMyDoctorProfile,
  updateMyDoctorProfile,
};