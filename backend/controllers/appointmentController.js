const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

// Create Appointment
const createAppointment = async (req, res) => {
  try {
    const {
      patient: patientId,
      doctor,
      appointmentDate,
      appointmentTime,
      reason,
    } = req.body;

    // ================================
    // BASIC VALIDATION
    // ================================

    if (
      !doctor ||
      !appointmentDate ||
      !appointmentTime ||
      !reason
    ) {
      return res.status(400).json({
        message:
          "Doctor, date, time and reason are required",
      });
    }

    // ================================
    // FIND PATIENT
    // ================================

    let patient;

    if (req.user.role === "patient") {
      // Patient is automatically taken
      // from logged-in user

      patient = await Patient.findOne({
        user: req.user.id,
      });

      if (!patient) {
        return res.status(404).json({
          message: "Patient profile not found",
        });
      }
    } else {
      // Admin/doctor can provide patient ID

      if (!patientId) {
        return res.status(400).json({
          message: "Patient is required",
        });
      }

      patient = await Patient.findById(
        patientId
      );

      if (!patient) {
        return res.status(404).json({
          message: "Patient not found",
        });
      }
    }

    // ================================
    // CHECK DOCTOR
    // ================================

    const doctorData = await Doctor.findById(
      doctor
    );

    if (!doctorData) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    if (doctorData.status !== "active") {
      return res.status(400).json({
        message: "Doctor is currently inactive",
      });
    }

    // ================================
    // CHECK DUPLICATE APPOINTMENT
    // ================================

    const existingAppointment =
      await Appointment.findOne({
        doctor,
        appointmentDate: new Date(
          appointmentDate
        ),
        appointmentTime,
        status: {
          $in: ["pending", "confirmed"],
        },
      });

    if (existingAppointment) {
      return res.status(409).json({
        message:
          "This time slot is already booked",
      });
    }

    // ================================
    // CREATE APPOINTMENT
    // ================================

    const appointment =
      await Appointment.create({
        patient: patient._id,
        doctor,
        appointmentDate: new Date(
          appointmentDate
        ),
        appointmentTime,
        reason,
      });

    // ================================
    // POPULATE RESPONSE
    // ================================

    await appointment.populate([
      {
        path: "patient",
        populate: {
          path: "user",
          select: "name email",
        },
      },
      {
        path: "doctor",
        populate: [
          {
            path: "user",
            select: "name email",
          },
          {
            path: "department",
            select: "name description",
          },
        ],
      },
    ]);

    return res.status(201).json({
      message:
        "Appointment booked successfully",
      appointment,
    });

  } catch (error) {
    console.error(
      "Create appointment error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Appointments
const getAllAppointments = async (req, res) => {
  try {
    let appointments;

    // ADMIN → see all appointments
    if (req.user.role === "admin") {
      appointments = await Appointment.find()
        .populate({
          path: "patient",
          populate: {
            path: "user",
            select: "name email",
          },
        })
        .populate({
          path: "doctor",
          populate: [
            {
              path: "user",
              select: "name email",
            },
            {
              path: "department",
              select: "name",
            },
          ],
        });

      return res.status(200).json({ appointments });
    }

    // DOCTOR → see only his/her appointments
    if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({
        user: req.user.id,
      });

      if (!doctor) {
        return res.status(404).json({
          message: "Doctor profile not found",
        });
      }

      appointments = await Appointment.find({
        doctor: doctor._id,
      })
        .populate({
          path: "patient",
          populate: {
            path: "user",
            select: "name email",
          },
        })
        .populate({
          path: "doctor",
          populate: [
            {
              path: "user",
              select: "name email",
            },
            {
              path: "department",
              select: "name",
            },
          ],
        });

      return res.status(200).json({ appointments });
    }

    // PATIENT → see only his/her appointments
    if (req.user.role === "patient") {
      const patient = await Patient.findOne({
        user: req.user.id,
      });

      if (!patient) {
        return res.status(404).json({
          message: "Patient profile not found",
        });
      }

      appointments = await Appointment.find({
        patient: patient._id,
      })
        .populate({
          path: "patient",
          populate: {
            path: "user",
            select: "name email",
          },
        })
        .populate({
          path: "doctor",
          populate: [
            {
              path: "user",
              select: "name email",
            },
            {
              path: "department",
              select: "name",
            },
          ],
        });

      return res.status(200).json({ appointments });
    }

    return res.status(403).json({
      message: "Access denied",
    });
  } catch (error) {
    console.error("Get appointments error:", error);

    res.status(500).json({
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
};

// Get patients assigned to logged-in doctor
const getDoctorPatients = async (req, res) => {
  try {
    // Only doctors can access this API
    if (req.user.role !== "doctor") {
      return res.status(403).json({
        message: "Only doctors can access this resource",
      });
    }

    // Find doctor profile using logged-in user's ID
    const doctor = await Doctor.findOne({
      user: req.user.id,
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    // Find all appointments belonging to this doctor
    const appointments = await Appointment.find({
      doctor: doctor._id,
    }).populate({
      path: "patient",
      populate: {
        path: "user",
        select: "name email role",
      },
    });

    // Remove duplicate patients
    const patientsMap = new Map();

    appointments.forEach((appointment) => {
      if (appointment.patient) {
        patientsMap.set(
          appointment.patient._id.toString(),
          appointment.patient
        );
      }
    });

    const patients = Array.from(patientsMap.values());

    // Send patients
    res.status(200).json({
      message: "Doctor patients retrieved successfully",
      patients,
    });
  } catch (error) {
    console.error("Get doctor patients error:", error);

    res.status(500).json({
      message: "Failed to fetch doctor patients",
      error: error.message,
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
          select: "name email",
        },
      })
      .populate({
        path: "doctor",
        populate: [
          {
            path: "user",
            select: "name email",
          },
          {
            path: "department",
            select: "name description",
          },
        ],
      });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // Admin can access any appointment
    if (req.user.role === "admin") {
      return res.status(200).json({
        appointment,
      });
    }

    // Doctor can access only their own appointments
    if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({
        user: req.user.id,
      });

      if (!doctor || appointment.doctor._id.toString() !== doctor._id.toString()) {
        return res.status(403).json({
          message: "Access denied",
        });
      }
    }

    // Patient can access only their own appointments
    if (req.user.role === "patient") {
      const patient = await Patient.findOne({
        user: req.user.id,
      });

      if (!patient || appointment.patient._id.toString() !== patient._id.toString()) {
        return res.status(403).json({
          message: "Access denied",
        });
      }
    }

    res.status(200).json({
      appointment,
    });
  } catch (error) {
    console.error("Get appointment error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
// Update Appointment
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // Admin can update anything
    if (req.user.role === "admin") {
      Object.assign(appointment, req.body);

      await appointment.save();

      return res.status(200).json({
        message: "Appointment updated successfully",
        appointment,
      });
    }

    // Doctor
    if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({
        user: req.user.id,
      });

      if (
        !doctor ||
        appointment.doctor.toString() !== doctor._id.toString()
      ) {
        return res.status(403).json({
          message: "You can only update your own appointments",
        });
      }

      // Doctor can update appointment status/notes
      if (req.body.status !== undefined) {
        appointment.status = req.body.status;
      }

      if (req.body.notes !== undefined) {
        appointment.notes = req.body.notes;
      }
    }

    // Patient
    if (req.user.role === "patient") {
      const patient = await Patient.findOne({
        user: req.user.id,
      });

      if (
        !patient ||
        appointment.patient.toString() !== patient._id.toString()
      ) {
        return res.status(403).json({
          message: "You can only update your own appointments",
        });
      }

      // Patient should only cancel
      if (req.body.status !== "cancelled") {
        return res.status(403).json({
          message: "Patients can only cancel appointments",
        });
      }

      appointment.status = "cancelled";
    }

    await appointment.save();

    const updatedAppointment = await Appointment.findById(
      appointment._id
    )
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .populate({
        path: "doctor",
        populate: [
          {
            path: "user",
            select: "name email",
          },
          {
            path: "department",
            select: "name description",
          },
        ],
      });

    res.status(200).json({
      message: "Appointment updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Update appointment error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
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
  getDoctorPatients,
};