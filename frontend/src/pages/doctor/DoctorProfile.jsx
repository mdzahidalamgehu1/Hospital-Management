import { useEffect, useState } from "react";
import {
  FaUserMd,
  FaEdit,
  FaSave,
  FaTimes,
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";

import api from "../../services/api";
import "./DoctorProfile.css";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    specialization: "",
    qualifications: "",
    experience: "",
    phone: "",
    consultationFee: "",
    availableDays: [],
    startTime: "",
    endTime: "",
  });

  // ==========================================
  // GET DOCTOR PROFILE
  // ==========================================

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/doctors/me");

      const doctorData = response.data.doctor;

      setDoctor(doctorData);

      setFormData({
        specialization: doctorData.specialization || "",
        qualifications: doctorData.qualifications || "",
        experience: doctorData.experience ?? "",
        phone: doctorData.phone || "",
        consultationFee: doctorData.consultationFee ?? "",
        availableDays: doctorData.availableDays || [],
        startTime: doctorData.availableTime?.start || "",
        endTime: doctorData.availableTime?.end || "",
      });
    } catch (error) {
      console.error("Fetch doctor profile error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load doctor profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // ==========================================
  // HANDLE AVAILABLE DAYS
  // ==========================================

  const handleDayChange = (day) => {
    setFormData((previousData) => {
      const isSelected =
        previousData.availableDays.includes(day);

      if (isSelected) {
        return {
          ...previousData,
          availableDays:
            previousData.availableDays.filter(
              (item) => item !== day
            ),
        };
      }

      return {
        ...previousData,
        availableDays: [
          ...previousData.availableDays,
          day,
        ],
      };
    });
  };

  // ==========================================
  // EDIT PROFILE
  // ==========================================

  const handleEdit = () => {
    setMessage("");
    setError("");
    setEditing(true);
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancel = () => {
    setEditing(false);
    setMessage("");
    setError("");

    // Restore original doctor data
    setFormData({
      specialization: doctor.specialization || "",
      qualifications: doctor.qualifications || "",
      experience: doctor.experience ?? "",
      phone: doctor.phone || "",
      consultationFee: doctor.consultationFee ?? "",
      availableDays: doctor.availableDays || [],
      startTime: doctor.availableTime?.start || "",
      endTime: doctor.availableTime?.end || "",
    });
  };

  // ==========================================
  // UPDATE PROFILE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setMessage("");
      setError("");

      const response = await api.put("/doctors/me", {
        specialization: formData.specialization,
        qualifications: formData.qualifications,
        experience: Number(formData.experience),
        phone: formData.phone,
        consultationFee: Number(
          formData.consultationFee
        ),
        availableDays: formData.availableDays,

        availableTime: {
          start: formData.startTime,
          end: formData.endTime,
        },
      });

      setDoctor(response.data.doctor);

      setMessage(
        response.data.message ||
          "Profile updated successfully"
      );

      setEditing(false);
    } catch (error) {
      console.error("Update doctor profile error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update doctor profile"
      );
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    navigate("/login");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="doctor-profile-wrapper">

        {/* Navbar */}
        <nav className="doctor-navbar">
          <div className="doctor-navbar-container">

            <Link
              to="/doctor"
              className="doctor-navbar-logo"
            >
              <FaUserMd />
              <span>MediCare</span>
            </Link>

            <div className="doctor-navbar-links">

              <Link
                to="/doctor"
                className="doctor-nav-link"
              >
                <FaHome />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/doctor/patients"
                className="doctor-nav-link"
              >
                <FaUsers />
                <span>My Patients</span>
              </Link>

              <Link
                to="/doctor/appointments"
                className="doctor-nav-link"
              >
                <FaCalendarAlt />
                <span>Appointments</span>
              </Link>

              <Link
                to="/doctor/profile"
                className="doctor-nav-link active"
              >
                <FaUserMd />
                <span>My Profile</span>
              </Link>

            </div>

            <button
              className="doctor-logout-btn"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>

          </div>
        </nav>

        <div className="doctor-profile-loading">
          Loading doctor profile...
        </div>

      </div>
    );
  }

  // ==========================================
  // PROFILE NOT FOUND
  // ==========================================

  if (!doctor) {
    return (
      <div className="doctor-profile-wrapper">

        {/* Navbar */}
        <nav className="doctor-navbar">
          <div className="doctor-navbar-container">

            <Link
              to="/doctor"
              className="doctor-navbar-logo"
            >
              <FaUserMd />
              <span>MediCare</span>
            </Link>

            <div className="doctor-navbar-links">

              <Link
                to="/doctor"
                className="doctor-nav-link"
              >
                <FaHome />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/doctor/patients"
                className="doctor-nav-link"
              >
                <FaUsers />
                <span>My Patients</span>
              </Link>

              <Link
                to="/doctor/appointments"
                className="doctor-nav-link"
              >
                <FaCalendarAlt />
                <span>Appointments</span>
              </Link>

              <Link
                to="/doctor/profile"
                className="doctor-nav-link active"
              >
                <FaUserMd />
                <span>My Profile</span>
              </Link>

            </div>

            <button
              className="doctor-logout-btn"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>

          </div>
        </nav>

        <div className="doctor-profile-error">
          {error || "Doctor profile not found"}
        </div>

      </div>
    );
  }

  return (
    <div className="doctor-profile-wrapper">

      {/* ==================================================
          DOCTOR NAVBAR
      ================================================== */}

      <nav className="doctor-navbar">

        <div className="doctor-navbar-container">

          {/* Logo */}

          <Link
            to="/doctor"
            className="doctor-navbar-logo"
          >
            <FaUserMd />

            <span>MediCare</span>
          </Link>


          {/* Navigation */}

          <div className="doctor-navbar-links">

            <Link
              to="/doctor"
              className={`doctor-nav-link ${
                location.pathname === "/doctor"
                  ? "active"
                  : ""
              }`}
            >
              <FaHome />

              <span>
                Dashboard
              </span>
            </Link>


            <Link
              to="/doctor/patients"
              className={`doctor-nav-link ${
                location.pathname ===
                "/doctor/patients"
                  ? "active"
                  : ""
              }`}
            >
              <FaUsers />

              <span>
                My Patients
              </span>
            </Link>


            <Link
              to="/doctor/appointments"
              className={`doctor-nav-link ${
                location.pathname ===
                "/doctor/appointments"
                  ? "active"
                  : ""
              }`}
            >
              <FaCalendarAlt />

              <span>
                Appointments
              </span>
            </Link>


            <Link
              to="/doctor/profile"
              className={`doctor-nav-link ${
                location.pathname ===
                "/doctor/profile"
                  ? "active"
                  : ""
              }`}
            >
              <FaUserMd />

              <span>
                My Profile
              </span>
            </Link>

          </div>


          {/* Logout */}

          <button
            className="doctor-logout-btn"
            onClick={handleLogout}
          >
            <FaSignOutAlt />

            <span>
              Logout
            </span>
          </button>

        </div>

      </nav>


      {/* ==================================================
          PROFILE CONTENT
      ================================================== */}

      <main className="doctor-profile-page">

        {/* Header */}

        <div className="doctor-profile-header">

          <div className="doctor-profile-title">

            <div className="doctor-profile-icon">
              <FaUserMd />
            </div>

            <div>
              <h1>
                My Profile
              </h1>

              <p>
                Manage your professional information
              </p>
            </div>

          </div>


          {/* Edit / Cancel */}

          {!editing ? (

            <button
              className="doctor-edit-btn"
              onClick={handleEdit}
            >
              <FaEdit />

              Edit Profile
            </button>

          ) : (

            <button
              className="doctor-cancel-btn"
              onClick={handleCancel}
            >
              <FaTimes />

              Cancel
            </button>

          )}

        </div>


        {/* Success Message */}

        {message && (
          <div className="doctor-success-message">
            {message}
          </div>
        )}


        {/* Error Message */}

        {error && (
          <div className="doctor-error-message">
            {error}
          </div>
        )}


        {/* ==================================================
            VIEW PROFILE
        ================================================== */}

        {!editing ? (

          <div className="doctor-profile-grid">

            {/* Basic Information */}

            <section className="doctor-profile-card">

              <h2>
                Basic Information
              </h2>

              <div className="doctor-info-grid">

                <div className="doctor-info-item">
                  <span>
                    Name
                  </span>

                  <strong>
                    {doctor.user?.name || "N/A"}
                  </strong>
                </div>


                <div className="doctor-info-item">
                  <span>
                    Email
                  </span>

                  <strong>
                    {doctor.user?.email || "N/A"}
                  </strong>
                </div>


                <div className="doctor-info-item">
                  <span>
                    Phone
                  </span>

                  <strong>
                    {doctor.phone || "N/A"}
                  </strong>
                </div>


                <div className="doctor-info-item">
                  <span>
                    Specialization
                  </span>

                  <strong>
                    {doctor.specialization || "N/A"}
                  </strong>
                </div>


                <div className="doctor-info-item">
                  <span>
                    Qualifications
                  </span>

                  <strong>
                    {doctor.qualifications || "N/A"}
                  </strong>
                </div>


                <div className="doctor-info-item">
                  <span>
                    Experience
                  </span>

                  <strong>
                    {doctor.experience ?? 0} years
                  </strong>
                </div>

              </div>

            </section>


            {/* Professional Information */}

            <section className="doctor-profile-card">

              <h2>
                Professional Information
              </h2>

              <div className="doctor-info-grid">

                <div className="doctor-info-item">
                  <span>
                    Department
                  </span>

                  <strong>
                    {doctor.department?.name || "N/A"}
                  </strong>
                </div>


                <div className="doctor-info-item">
                  <span>
                    Consultation Fee
                  </span>

                  <strong>
                    ₹{doctor.consultationFee || 0}
                  </strong>
                </div>


                <div className="doctor-info-item">
                  <span>
                    Status
                  </span>

                  <strong className="doctor-active-status">
                    {doctor.status || "active"}
                  </strong>
                </div>

              </div>

            </section>


            {/* Availability */}

            <section className="doctor-profile-card">

              <h2>
                Availability
              </h2>

              <div className="availability-section">

                <div>

                  <span className="availability-label">
                    Available Days
                  </span>

                  <div className="doctor-days">

                    {doctor.availableDays?.length > 0 ? (

                      doctor.availableDays.map((day) => (

                        <span
                          className="doctor-day"
                          key={day}
                        >
                          {day}
                        </span>

                      ))

                    ) : (

                      <span>
                        No days added
                      </span>

                    )}

                  </div>

                </div>


                <div className="doctor-time">

                  <span className="availability-label">
                    Available Time
                  </span>

                  <strong>
                    {doctor.availableTime?.start ||
                      "--:--"}

                    {" - "}

                    {doctor.availableTime?.end ||
                      "--:--"}
                  </strong>

                </div>

              </div>

            </section>

          </div>

        ) : (

          /* ==================================================
             EDIT PROFILE
          ================================================== */

          <form
            className="doctor-profile-form"
            onSubmit={handleSubmit}
          >

            {/* Professional Information */}

            <section className="doctor-profile-card">

              <h2>
                Edit Professional Information
              </h2>

              <div className="doctor-form-grid">

                <div className="doctor-form-group">

                  <label>
                    Specialization
                  </label>

                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="doctor-form-group">

                  <label>
                    Qualifications
                  </label>

                  <input
                    type="text"
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="doctor-form-group">

                  <label>
                    Experience (Years)
                  </label>

                  <input
                    type="number"
                    name="experience"
                    min="0"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="doctor-form-group">

                  <label>
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="doctor-form-group">

                  <label>
                    Consultation Fee
                  </label>

                  <input
                    type="number"
                    name="consultationFee"
                    min="0"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

            </section>


            {/* Available Days */}

            <section className="doctor-profile-card">

              <h2>
                Available Days
              </h2>

              <div className="doctor-days-selection">

                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (

                  <label
                    key={day}
                    className="doctor-day-checkbox"
                  >

                    <input
                      type="checkbox"
                      checked={formData.availableDays.includes(
                        day
                      )}
                      onChange={() =>
                        handleDayChange(day)
                      }
                    />

                    <span>
                      {day}
                    </span>

                  </label>

                ))}

              </div>

            </section>


            {/* Available Time */}

            <section className="doctor-profile-card">

              <h2>
                Available Time
              </h2>

              <div className="doctor-form-grid">

                <div className="doctor-form-group">

                  <label>
                    Start Time
                  </label>

                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="doctor-form-group">

                  <label>
                    End Time
                  </label>

                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

            </section>


            {/* Save Button */}

            <button
              type="submit"
              className="doctor-save-btn"
            >
              <FaSave />

              Save Changes
            </button>

          </form>

        )}

      </main>

    </div>
  );
};

export default DoctorProfile;