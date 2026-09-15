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
  FaStethoscope,
  FaGraduationCap,
  FaBriefcase,
  FaPhoneAlt,
  FaMoneyBillWave,
  FaBuilding,
  FaClock,
  FaCalendarCheck,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";

import api from "../../services/api";
import "./DoctorProfile.css";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [doctor, setDoctor] = useState(null);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    department: "",
    specialization: "",
    qualifications: "",
    experience: "",
    phone: "",
    consultationFee: "",
    availableDays: [],
    startTime: "",
    endTime: "",
  });

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // ==================================================
  // FETCH DOCTOR PROFILE
  // ==================================================

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/doctors/me");

      const doctorData = response.data.doctor;

      if (!doctorData) {
        setDoctor(null);
        setEditing(true);
        return;
      }

      setDoctor(doctorData);

      setFormData({
        department:
          doctorData.department?._id ||
          doctorData.department ||
          "",
        specialization: doctorData.specialization || "",
        qualifications: doctorData.qualifications || "",
        experience: doctorData.experience ?? "",
        phone: doctorData.phone || "",
        consultationFee:
          doctorData.consultationFee ?? "",
        availableDays:
          doctorData.availableDays || [],
        startTime:
          doctorData.availableTime?.start || "",
        endTime:
          doctorData.availableTime?.end || "",
      });
    } catch (error) {
      console.error(
        "Fetch doctor profile error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load doctor profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // FETCH DEPARTMENTS
  // ==================================================

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments");

      setDepartments(
        response.data.departments || []
      );
    } catch (error) {
      console.error(
        "Fetch departments error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load departments"
      );
    }
  };

  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    fetchProfile();
    fetchDepartments();
  }, []);

  // ==================================================
  // HANDLE INPUT
  // ==================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // ==================================================
  // HANDLE DAYS
  // ==================================================

  const handleDayChange = (day) => {
    setFormData((previousData) => {
      const selected =
        previousData.availableDays.includes(day);

      if (selected) {
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

  // ==================================================
  // EDIT
  // ==================================================

  const handleEdit = () => {
    setMessage("");
    setError("");
    setEditing(true);
  };

  // ==================================================
  // CANCEL
  // ==================================================

  const handleCancel = () => {
    setMessage("");
    setError("");

    if (!doctor) {
      return;
    }

    setFormData({
      department:
        doctor.department?._id ||
        doctor.department ||
        "",
      specialization:
        doctor.specialization || "",
      qualifications:
        doctor.qualifications || "",
      experience:
        doctor.experience ?? "",
      phone:
        doctor.phone || "",
      consultationFee:
        doctor.consultationFee ?? "",
      availableDays:
        doctor.availableDays || [],
      startTime:
        doctor.availableTime?.start || "",
      endTime:
        doctor.availableTime?.end || "",
    });

    setEditing(false);
  };

  // ==================================================
  // SAVE PROFILE
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!formData.department) {
      setError("Please select a department.");
      return;
    }

    if (!formData.specialization.trim()) {
      setError("Please enter your specialization.");
      return;
    }

    if (!formData.qualifications.trim()) {
      setError("Please enter your qualifications.");
      return;
    }

    if (formData.experience === "") {
      setError("Please enter your experience.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (formData.consultationFee === "") {
      setError(
        "Please enter your consultation fee."
      );
      return;
    }

    if (!formData.startTime) {
      setError("Please select your start time.");
      return;
    }

    if (!formData.endTime) {
      setError("Please select your end time.");
      return;
    }

    if (formData.availableDays.length === 0) {
      setError(
        "Please select at least one available day."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await api.put("/doctors/me", {
        department: formData.department,

        specialization:
          formData.specialization.trim(),

        qualifications:
          formData.qualifications.trim(),

        experience:
          Number(formData.experience),

        phone:
          formData.phone.trim(),

        consultationFee:
          Number(formData.consultationFee),

        availableDays:
          formData.availableDays,

        availableTime: {
          start: formData.startTime,
          end: formData.endTime,
        },
      });

      const savedDoctor = response.data.doctor;

      setDoctor(savedDoctor);

      setFormData({
        department:
          savedDoctor.department?._id ||
          savedDoctor.department ||
          "",

        specialization:
          savedDoctor.specialization || "",

        qualifications:
          savedDoctor.qualifications || "",

        experience:
          savedDoctor.experience ?? "",

        phone:
          savedDoctor.phone || "",

        consultationFee:
          savedDoctor.consultationFee ?? "",

        availableDays:
          savedDoctor.availableDays || [],

        startTime:
          savedDoctor.availableTime?.start || "",

        endTime:
          savedDoctor.availableTime?.end || "",
      });

      setEditing(false);

      setMessage(
        response.data.message ||
          "Doctor profile saved successfully."
      );
    } catch (error) {
      console.error(
        "Save doctor profile error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save doctor profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    navigate("/login");
  };

  // ==================================================
  // NAVBAR
  // ==================================================

  const Navbar = () => (
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
            className={`doctor-nav-link ${
              location.pathname === "/doctor"
                ? "active"
                : ""
            }`}
          >
            <FaHome />
            <span>Dashboard</span>
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
            <span>My Patients</span>
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
            <span>Appointments</span>
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
  );

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="doctor-profile-wrapper">
        <Navbar />

        <div className="doctor-profile-loading">
          <div className="profile-loader">
            <FaUserMd />
          </div>

          <h3>
            Loading your profile...
          </h3>

          <p>
            Please wait while we fetch your information.
          </p>
        </div>
      </div>
    );
  }

  // ==================================================
  // MAIN UI
  // ==================================================

  return (
    <div className="doctor-profile-wrapper">

      <Navbar />

      <main className="doctor-profile-page">

        {/* ==========================================
            PAGE HEADER
        ========================================== */}

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

          {doctor && !editing && (
            <button
              className="doctor-edit-btn"
              onClick={handleEdit}
            >
              <FaEdit />
              Edit Profile
            </button>
          )}

          {doctor && editing && (
            <button
              className="doctor-cancel-btn"
              onClick={handleCancel}
            >
              <FaTimes />
              Cancel
            </button>
          )}

        </div>

        {/* ==========================================
            MESSAGES
        ========================================== */}

        {message && (
          <div className="doctor-success-message">
            <FaCalendarCheck />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="doctor-error-message">
            <FaTimes />
            <span>{error}</span>
          </div>
        )}

        {/* ==========================================
            COMPLETE PROFILE INTRO
        ========================================== */}

        {!doctor && editing && (
          <div className="profile-completion-banner">

            <div className="completion-banner-icon">
              <FaStethoscope />
            </div>

            <div>
              <h2>
                Complete Your Professional Profile
              </h2>

              <p>
                Your doctor account is ready.
                Add your professional details below
                to complete your profile.
              </p>
            </div>

          </div>
        )}

        {/* ==========================================
            VIEW PROFILE
        ========================================== */}

        {doctor && !editing ? (

          <div className="doctor-profile-grid">

            {/* BASIC INFORMATION */}

            <section className="doctor-profile-card">

              <div className="profile-card-heading">

                <div className="profile-section-icon">
                  <FaUserMd />
                </div>

                <div>
                  <h2>
                    Basic Information
                  </h2>

                  <p>
                    Your account information
                  </p>
                </div>

              </div>

              <div className="doctor-info-grid">

                <div className="doctor-info-item">
                  <span>Name</span>
                  <strong>
                    {doctor.user?.name || "N/A"}
                  </strong>
                </div>

                <div className="doctor-info-item">
                  <span>Email</span>
                  <strong>
                    {doctor.user?.email || "N/A"}
                  </strong>
                </div>

                <div className="doctor-info-item">
                  <span>Phone</span>
                  <strong>
                    {doctor.phone || "N/A"}
                  </strong>
                </div>

                <div className="doctor-info-item">
                  <span>Specialization</span>
                  <strong>
                    {doctor.specialization || "N/A"}
                  </strong>
                </div>

                <div className="doctor-info-item">
                  <span>Qualifications</span>
                  <strong>
                    {doctor.qualifications || "N/A"}
                  </strong>
                </div>

                <div className="doctor-info-item">
                  <span>Experience</span>
                  <strong>
                    {doctor.experience ?? 0} years
                  </strong>
                </div>

              </div>

            </section>

            {/* PROFESSIONAL INFORMATION */}

            <section className="doctor-profile-card">

              <div className="profile-card-heading">

                <div className="profile-section-icon">
                  <FaStethoscope />
                </div>

                <div>
                  <h2>
                    Professional Information
                  </h2>

                  <p>
                    Your medical practice details
                  </p>
                </div>

              </div>

              <div className="doctor-info-grid">

                <div className="doctor-info-item">
                  <span>Department</span>
                  <strong>
                    {doctor.department?.name ||
                      "N/A"}
                  </strong>
                </div>

                <div className="doctor-info-item">
                  <span>Consultation Fee</span>
                  <strong>
                    ₹{doctor.consultationFee || 0}
                  </strong>
                </div>

                <div className="doctor-info-item">
                  <span>Status</span>
                  <strong className="doctor-active-status">
                    {doctor.status || "active"}
                  </strong>
                </div>

              </div>

            </section>

            {/* AVAILABILITY */}

            <section className="doctor-profile-card">

              <div className="profile-card-heading">

                <div className="profile-section-icon">
                  <FaClock />
                </div>

                <div>
                  <h2>
                    Availability
                  </h2>

                  <p>
                    Your consultation schedule
                  </p>
                </div>

              </div>

              <div className="availability-section">

                <div>

                  <span className="availability-label">
                    Available Days
                  </span>

                  <div className="doctor-days">

                    {doctor.availableDays?.length > 0
                      ? doctor.availableDays.map(
                          (day) => (
                            <span
                              className="doctor-day"
                              key={day}
                            >
                              {day}
                            </span>
                          )
                        )
                      : (
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

          /* ==========================================
             CREATE / EDIT FORM
          ========================================== */

          <form
            className="doctor-profile-form attractive-form"
            onSubmit={handleSubmit}
          >

            {/* ======================================
                PROFESSIONAL INFORMATION
            ====================================== */}

            <section className="doctor-profile-card form-section">

              <div className="form-section-header">

                <div className="form-section-icon">
                  <FaStethoscope />
                </div>

                <div>
                  <h2>
                    Professional Information
                  </h2>

                  <p>
                    Tell us about your medical expertise
                  </p>
                </div>

              </div>

              <div className="doctor-form-grid">

                {/* Department */}

                <div className="doctor-form-group">

                  <label>
                    <FaBuilding />
                    Department
                  </label>

                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select your department
                    </option>

                    {departments.map(
                      (department) => (
                        <option
                          key={department._id}
                          value={department._id}
                        >
                          {department.name}
                        </option>
                      )
                    )}

                  </select>

                  <small>
                    Select the department where you
                    practice.
                  </small>

                </div>

                {/* Specialization */}

                <div className="doctor-form-group">

                  <label>
                    <FaStethoscope />
                    Specialization
                  </label>

                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="e.g. Cardiologist"
                    required
                  />

                  <small>
                    Your primary medical specialization.
                  </small>

                </div>

                {/* Qualifications */}

                <div className="doctor-form-group">

                  <label>
                    <FaGraduationCap />
                    Qualifications
                  </label>

                  <input
                    type="text"
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleChange}
                    placeholder="e.g. MBBS, MD"
                    required
                  />

                  <small>
                    Enter your medical degrees and
                    qualifications.
                  </small>

                </div>

                {/* Experience */}

                <div className="doctor-form-group">

                  <label>
                    <FaBriefcase />
                    Experience
                  </label>

                  <div className="input-with-suffix">

                    <input
                      type="number"
                      name="experience"
                      min="0"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="5"
                      required
                    />

                    <span>
                      Years
                    </span>

                  </div>

                  <small>
                    Total professional experience.
                  </small>

                </div>

                {/* Phone */}

                <div className="doctor-form-group">

                  <label>
                    <FaPhoneAlt />
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    required
                  />

                  <small>
                    Patients may use this for contact.
                  </small>

                </div>

                {/* Consultation Fee */}

                <div className="doctor-form-group">

                  <label>
                    <FaMoneyBillWave />
                    Consultation Fee
                  </label>

                  <div className="input-with-prefix">

                    <span>
                      ₹
                    </span>

                    <input
                      type="number"
                      name="consultationFee"
                      min="0"
                      value={
                        formData.consultationFee
                      }
                      onChange={handleChange}
                      placeholder="500"
                      required
                    />

                  </div>

                  <small>
                    Your standard consultation charge.
                  </small>

                </div>

              </div>

            </section>

            {/* ======================================
                AVAILABLE DAYS
            ====================================== */}

            <section className="doctor-profile-card form-section">

              <div className="form-section-header">

                <div className="form-section-icon">
                  <FaCalendarCheck />
                </div>

                <div>
                  <h2>
                    Available Days
                  </h2>

                  <p>
                    Choose the days when patients can
                    book appointments.
                  </p>
                </div>

              </div>

              <div className="doctor-days-selection">

                {days.map((day) => {

                  const selected =
                    formData.availableDays.includes(
                      day
                    );

                  return (
                    <button
                      type="button"
                      key={day}
                      className={`day-select-btn ${
                        selected
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleDayChange(day)
                      }
                    >

                      <span className="day-short">
                        {day.substring(0, 3)}
                      </span>

                      <span>
                        {day}
                      </span>

                      {selected && (
                        <FaCalendarCheck />
                      )}

                    </button>
                  );
                })}

              </div>

              <div className="selected-days-info">

                <FaCalendarCheck />

                <span>
                  {formData.availableDays.length ===
                  0
                    ? "No days selected"
                    : `${formData.availableDays.length} day${
                        formData.availableDays.length >
                        1
                          ? "s"
                          : ""
                      } selected`}
                </span>

              </div>

            </section>

            {/* ======================================
                AVAILABLE TIME
            ====================================== */}

            <section className="doctor-profile-card form-section">

              <div className="form-section-header">

                <div className="form-section-icon">
                  <FaClock />
                </div>

                <div>
                  <h2>
                    Consultation Hours
                  </h2>

                  <p>
                    Set your daily consultation
                    availability.
                  </p>
                </div>

              </div>

              <div className="time-selection-grid">

                <div className="time-box">

                  <div className="time-box-icon">
                    <FaClock />
                  </div>

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

                </div>

                <div className="time-divider">
                  <span>
                    TO
                  </span>
                </div>

                <div className="time-box">

                  <div className="time-box-icon">
                    <FaClock />
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

              </div>

            </section>

            {/* ======================================
                FORM FOOTER
            ====================================== */}

            <div className="doctor-form-footer">

              <div className="form-footer-text">

                <FaUserMd />

                <div>
                  <strong>
                    Ready to save your profile?
                  </strong>

                  <span>
                    Your information will be securely
                    saved to your doctor profile.
                  </span>
                </div>

              </div>

              <div className="form-footer-actions">

                {doctor && (
                  <button
                    type="button"
                    className="form-cancel-btn"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    <FaTimes />
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  className="doctor-save-btn attractive-save-btn"
                  disabled={saving}
                >

                  <FaSave />

                  {saving
                    ? "Saving..."
                    : doctor
                    ? "Save Changes"
                    : "Create Doctor Profile"}

                </button>

              </div>

            </div>

          </form>

        )}

      </main>

    </div>
  );
};

export default DoctorProfile;