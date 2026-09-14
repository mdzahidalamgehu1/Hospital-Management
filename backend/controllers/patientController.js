const Patient = require("../models/Patient");
const User = require("../models/User");

// Get logged-in patient profile
const getMyProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      user: req.user.id,
    }).populate("user", "name email role");

    if (!patient) {
      return res.status(404).json({
        message: "Patient profile not found",
      });
    }

    res.status(200).json({
      message: "Patient profile retrieved successfully",
      patient,
    });
  } catch (error) {
    console.error("Get patient profile error:", error);

    res.status(500).json({
      message: "Failed to fetch patient profile",
      error: error.message,
    });
  }
};


// Update logged-in patient profile
const updateMyProfile = async (req, res) => {
  try {
    const {
      dateOfBirth,
      gender,
      bloodGroup,
      phone,
      address,
      emergencyContact,
    } = req.body;

    const patient = await Patient.findOne({
      user: req.user.id,
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient profile not found",
      });
    }

    if (dateOfBirth !== undefined) {
      patient.dateOfBirth = dateOfBirth;
    }

    if (gender !== undefined) {
      patient.gender = gender;
    }

    if (bloodGroup !== undefined) {
      patient.bloodGroup = bloodGroup;
    }

    if (phone !== undefined) {
      patient.phone = phone;
    }

    if (address !== undefined) {
      patient.address = address;
    }

    if (emergencyContact !== undefined) {
      patient.emergencyContact = emergencyContact;
    }

    await patient.save();

    const updatedPatient = await Patient.findById(
      patient._id
    ).populate("user", "name email role");

    res.status(200).json({
      message: "Profile updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    console.error("Update patient profile error:", error);

    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};
// Create Patient
const createPatient = async (req, res) => {
  try {
    const {
      user,
      dateOfBirth,
      gender,
      bloodGroup,
      phone,
      address,
      emergencyContact,
    } = req.body;

    // Check required fields
    if (
      !user ||
      !dateOfBirth ||
      !gender ||
      !bloodGroup ||
      !phone ||
      !address ||
      !emergencyContact ||
      !emergencyContact.name ||
      !emergencyContact.phone ||
      !emergencyContact.relationship
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

    // User must be a patient
    if (existingUser.role !== "patient") {
      return res.status(400).json({
        message: "User is not a patient",
      });
    }

    // Check if patient profile already exists
    const existingPatient = await Patient.findOne({ user });

    if (existingPatient) {
      return res.status(400).json({
        message: "Patient already exists for this user",
      });
    }

    // Create patient
    const patient = await Patient.create({
      user,
      dateOfBirth,
      gender,
      bloodGroup,
      phone,
      address,
      emergencyContact,
    });

    // Populate user information
    const populatedPatient = await Patient.findById(patient._id).populate(
      "user",
      "name email role"
    );

    res.status(201).json({
      message: "Patient created successfully",
      patient: populatedPatient,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Patients
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate(
      "user",
      "name email role"
    );

    res.status(200).json({
      message: "Patients retrieved successfully",
      patients,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Patient
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate(
      "user",
      "name email role"
    );

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.status(200).json({
      message: "Patient retrieved successfully",
      patient,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Patient
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "name email role");

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.status(200).json({
      message: "Patient updated successfully",
      patient,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Patient
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.status(200).json({
      message: "Patient deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getMyProfile,
  updateMyProfile,
};