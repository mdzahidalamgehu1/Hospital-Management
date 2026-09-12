const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    // link doctor with user account
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    // link doctor with department
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },

    specialization: {
      type: String,
      required: true,
      trim: true
    },

    qualifications: {
      type: String,
      required: true,
      trim: true
    },

    experience: {
      type: Number,
      required: true,
      min: 0
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    consultationFee: {
      type: Number,
      required: true,
      min: 0
    },

    availableDays: {
      type: [String],
      default: []
    },

    availableTime: {
      start: {
        type: String,
        required: true
      },
      end: {
        type: String
      }
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
