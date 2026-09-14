import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiActivity,
  FiCalendar,
  FiClock,
  FiUser,
  FiFileText,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

import api from "../../services/api";
import "./BookAppointment.css";

const BookAppointment = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    doctor: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ================================
  // GET DOCTORS
  // ================================

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/doctors");

      setDoctors(response.data.doctors || []);
    } catch (err) {
      console.error("Fetch doctors error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load doctors"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // ================================
  // INPUT CHANGE
  // ================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ================================
  // BOOK APPOINTMENT
  // ================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.doctor) {
      setError("Please select a doctor.");
      return;
    }

    if (!formData.appointmentDate) {
      setError("Please select an appointment date.");
      return;
    }

    if (!formData.appointmentTime) {
      setError("Please select an appointment time.");
      return;
    }

    if (!formData.reason.trim()) {
      setError("Please enter the reason for your visit.");
      return;
    }

    try {
      setBooking(true);

      await api.post("/appointments", {
        doctor: formData.doctor,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        reason: formData.reason,
      });

      setSuccess(
        "Appointment booked successfully!"
      );

      setFormData({
        doctor: "",
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
      });

      setTimeout(() => {
        navigate("/patient/appointments");
      }, 1200);

    } catch (err) {
      console.error("Book appointment error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to book appointment"
      );
    } finally {
      setBooking(false);
    }
  };

  // ================================
  // SELECTED DOCTOR
  // ================================

  const selectedDoctor = doctors.find(
    (doctor) =>
      doctor._id === formData.doctor
  );

  return (
    <div className="book-appointment-page">

      {/* ================= NAVBAR ================= */}

      <header className="patient-navbar">

        <div className="patient-brand">

          <div className="patient-logo">
            <FiActivity />
          </div>

          <div>
            <h2>MediCare</h2>
            <span>Patient Portal</span>
          </div>

        </div>

        <nav className="patient-nav">

          <button
            onClick={() => navigate("/patient")}
          >
            Dashboard
          </button>

          <button
            onClick={() =>
              navigate("/patient/appointments")
            }
          >
            My Appointments
          </button>

          <button
            onClick={() =>
              navigate("/patient/profile")
            }
          >
            My Profile
          </button>

        </nav>

        <div className="patient-user">

          <div className="patient-small-avatar">
            P
          </div>

          <div>
            <strong>Patient</strong>
            <span>Patient</span>
          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="book-appointment-main">

        <button
          className="back-button"
          onClick={() =>
            navigate("/patient/appointments")
          }
        >
          <FiArrowLeft />
          Back to Appointments
        </button>

        <div className="booking-layout">

          {/* ================= LEFT INFO ================= */}

          <section className="booking-info">

            <span className="booking-label">
              PATIENT PORTAL
            </span>

            <h1>
              Book an Appointment
            </h1>

            <p>
              Schedule an appointment with one of
              our experienced doctors.
            </p>

            <div className="booking-info-list">

              <div>
                <div className="info-icon">
                  <FiUser />
                </div>

                <div>
                  <strong>
                    Choose your doctor
                  </strong>

                  <span>
                    Select a specialist based on
                    your healthcare needs.
                  </span>
                </div>
              </div>

              <div>
                <div className="info-icon">
                  <FiCalendar />
                </div>

                <div>
                  <strong>
                    Select a convenient date
                  </strong>

                  <span>
                    Choose the date that works best
                    for you.
                  </span>
                </div>
              </div>

              <div>
                <div className="info-icon">
                  <FiClock />
                </div>

                <div>
                  <strong>
                    Choose appointment time
                  </strong>

                  <span>
                    Enter your preferred consultation
                    time.
                  </span>
                </div>
              </div>

            </div>

          </section>

          {/* ================= FORM ================= */}

          <section className="booking-card">

            <div className="booking-card-header">

              <div>
                <span>
                  APPOINTMENT DETAILS
                </span>

                <h2>
                  Schedule Your Visit
                </h2>
              </div>

              <FiCalendar />

            </div>

            {/* ERROR */}

            {error && (
              <div className="booking-error">

                <FiAlertCircle />

                <span>{error}</span>

              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="booking-success">

                <FiCheckCircle />

                <span>{success}</span>

              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* DOCTOR */}

              <div className="form-group">

                <label>
                  Select Doctor
                </label>

                <div className="input-wrapper">

                  <FiUser />

                  <select
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleChange}
                    disabled={loading}
                  >

                    <option value="">
                      {loading
                        ? "Loading doctors..."
                        : "Choose a doctor"}
                    </option>

                    {doctors.map((doctor) => (

                      <option
                        value={doctor._id}
                        key={doctor._id}
                      >
                        Dr.{" "}
                        {doctor.user?.name ||
                          "Doctor"}{" "}
                        -{" "}
                        {doctor.specialization ||
                          "Specialist"}
                      </option>

                    ))}

                  </select>

                </div>

              </div>

              {/* SELECTED DOCTOR */}

              {selectedDoctor && (

                <div className="selected-doctor">

                  <div className="selected-doctor-avatar">

                    {selectedDoctor.user?.name
                      ?.charAt(0)
                      .toUpperCase() || "D"}

                  </div>

                  <div>

                    <strong>
                      Dr.{" "}
                      {selectedDoctor.user?.name ||
                        "Doctor"}
                    </strong>

                    <span>
                      {selectedDoctor.specialization ||
                        "Medical Specialist"}
                    </span>

                    <small>
                      {selectedDoctor.department?.name ||
                        "Department"}{" "}
                      • ₹
                      {selectedDoctor.consultationFee ||
                        0}{" "}
                      consultation
                    </small>

                  </div>

                </div>

              )}

              {/* DATE + TIME */}

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Appointment Date
                  </label>

                  <div className="input-wrapper">

                    <FiCalendar />

                    <input
                      type="date"
                      name="appointmentDate"
                      value={
                        formData.appointmentDate
                      }
                      onChange={handleChange}
                      min={
                        new Date()
                          .toISOString()
                          .split("T")[0]
                      }
                    />

                  </div>

                </div>

                <div className="form-group">

                  <label>
                    Appointment Time
                  </label>

                  <div className="input-wrapper">

                    <FiClock />

                    <input
                      type="time"
                      name="appointmentTime"
                      value={
                        formData.appointmentTime
                      }
                      onChange={handleChange}
                    />

                  </div>

                </div>

              </div>

              {/* REASON */}

              <div className="form-group">

                <label>
                  Reason for Visit
                </label>

                <div className="textarea-wrapper">

                  <FiFileText />

                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="Describe the reason for your visit..."
                    rows="5"
                    maxLength="500"
                  />

                </div>

                <small className="character-count">
                  {formData.reason.length}/500
                </small>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="confirm-booking-btn"
                disabled={booking || loading}
              >

                {booking ? (
                  <>
                    <span className="button-spinner"></span>
                    Booking...
                  </>
                ) : (
                  <>
                    <FiCalendar />
                    Confirm Appointment
                  </>
                )}

              </button>

            </form>

          </section>

        </div>

      </main>

    </div>
  );
};

export default BookAppointment;