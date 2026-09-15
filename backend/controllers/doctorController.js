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

// Create Doctor Profile / Update Doctor Profile
// Get logged-in doctor profile
const updateMyDoctorProfile = async (req, res) => {
  try {
    const {
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
      !department ||
      !specialization ||
      !qualifications ||
      experience === undefined ||
      !phone ||
      consultationFee === undefined ||
      !availableTime?.start
    ) {
      return res.status(400).json({
        message: "Please fill all doctor profile fields",
      });
    }

    // Check department
    const departmentExists = await Department.findById(department);

    if (!departmentExists) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    // Check logged-in user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Make sure user is doctor
    if (user.role !== "doctor") {
      return res.status(403).json({
        message: "Only doctors can create doctor profile",
      });
    }

    // Find existing Doctor profile
    let doctor = await Doctor.findOne({
      user: req.user.id,
    });

    // If Doctor profile doesn't exist → CREATE
    if (!doctor) {
      doctor = await Doctor.create({
        user: req.user.id,
        department,
        specialization,
        qualifications,
        experience,
        phone,
        consultationFee,
        availableDays: availableDays || [],
        availableTime,
      });
    }

    // If Doctor profile exists → UPDATE
    else {
      doctor.department = department;
      doctor.specialization = specialization;
      doctor.qualifications = qualifications;
      doctor.experience = experience;
      doctor.phone = phone;
      doctor.consultationFee = consultationFee;
      doctor.availableDays = availableDays || [];
      doctor.availableTime = availableTime;

      await doctor.save();
    }

    // Get updated doctor
    const updatedDoctor = await Doctor.findById(doctor._id)
      .populate("user", "name email role")
      .populate("department", "name description");

    res.status(200).json({
      message: "Doctor profile saved successfully",
      profileCompleted: true,
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error("Update doctor profile error:", error);

    res.status(500).json({
      message: "Failed to save doctor profile",
      error: error.message,
    });
  }
};


// Get Doctor Profile
const getMyDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      user: req.user.id,
    })
      .populate("user", "name email role")
      .populate("department", "name description");

    // Doctor profile doesn't exist yet
    if (!doctor) {
      return res.status(200).json({
        profileCompleted: false,
        doctor: null,
      });
    }

    res.status(200).json({
      profileCompleted: true,
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


module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getMyDoctorProfile,
  updateMyDoctorProfile,
};