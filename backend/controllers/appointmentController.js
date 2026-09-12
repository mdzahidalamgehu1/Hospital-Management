const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

// Create Appointment
const createAppointment = async (req, res) => {
  try {
    const {
      patient,
      doctor,
      appointmentDate,
      appointmentTime,
      reason,
      notes,
    } = req.body;

    // Check required fields
    if (
      !patient ||
      !doctor ||
      !appointmentDate ||
      !appointmentTime ||
      !reason
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    // Check patient exists
    const existingPatient = await Patient.findById(patient);

    if (!existingPatient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    // Check doctor exists
    const existingDoctor = await Doctor.findById(doctor);

    if (!existingDoctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    // Check doctor is active
    if (existingDoctor.status !== "active") {
      return res.status(400).json({
        message: "Doctor is currently inactive",
      });
    }

    // Check duplicate appointment slot
    const existingAppointment = await Appointment.findOne({
      doctor,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: {
        $in: ["pending", "confirmed"],
      },
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "This appointment slot is already booked",
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient,
      doctor,
      appointmentDate,
      appointmentTime,
      reason,
      notes,
    });

    // Populate patient and doctor
    const populatedAppointment = await Appointment.findById(
      appointment._id
    )
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "name email role",
        },
      })
      .populate({
        path: "doctor",
        populate: [
          {
            path: "user",
            select: "name email role",
          },
          {
            path: "department",
            select: "name",
          },
        ],
      });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: populatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "name email role",
        },
      })
      .populate({
        path: "doctor",
        populate: [
          {
            path: "user",
            select: "name email role",
          },
          {
            path: "department",
            select: "name",
          },
        ],
      })
      .sort({ appointmentDate: 1 });

    res.status(200).json({
      message: "Appointments retrieved successfully",
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Appointment
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "name email role",
        },
      })
      .populate({
        path: "doctor",
        populate: [
          {
            path: "user",
            select: "name email role",
          },
          {
            path: "department",
            select: "name",
          },
        ],
      });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      message: "Appointment retrieved successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Appointment
const updateAppointment = async (req, res) => {
  try {
    const {
      appointmentDate,
      appointmentTime,
      reason,
      notes,
      status,
    } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // Check duplicate slot when changing date/time
    if (appointmentDate || appointmentTime) {
      const newDate = appointmentDate
        ? new Date(appointmentDate)
        : appointment.appointmentDate;

      const newTime = appointmentTime
        ? appointmentTime
        : appointment.appointmentTime;

      const conflictingAppointment = await Appointment.findOne({
        _id: { $ne: appointment._id },
        doctor: appointment.doctor,
        appointmentDate: newDate,
        appointmentTime: newTime,
        status: {
          $in: ["pending", "confirmed"],
        },
      });

      if (conflictingAppointment) {
        return res.status(400).json({
          message: "This appointment slot is already booked",
        });
      }
    }

    // Update fields
    if (appointmentDate !== undefined) {
      appointment.appointmentDate = appointmentDate;
    }

    if (appointmentTime !== undefined) {
      appointment.appointmentTime = appointmentTime;
    }

    if (reason !== undefined) {
      appointment.reason = reason;
    }

    if (notes !== undefined) {
      appointment.notes = notes;
    }

    if (status !== undefined) {
      appointment.status = status;
    }

    await appointment.save();

    const updatedAppointment = await Appointment.findById(
      appointment._id
    )
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "name email role",
        },
      })
      .populate({
        path: "doctor",
        populate: [
          {
            path: "user",
            select: "name email role",
          },
          {
            path: "department",
            select: "name",
          },
        ],
      });

    res.status(200).json({
      message: "Appointment updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete / Cancel Appointment
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(
      req.params.id
    );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};