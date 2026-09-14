import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiActivity,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiUser,
  FiArrowRight,
  FiRefreshCw,
  FiPlus,
  FiHeart,
} from "react-icons/fi";

import api from "../../services/api";
import "./PatientDashboard.css";

const PatientDashboard = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/appointments");

      setAppointments(response.data.appointments || []);
    } catch (err) {
      console.error("Fetch patient appointments error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load your appointments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  /* ================================
     STATISTICS
  ================================= */

  const totalAppointments = appointments.length;

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending"
  ).length;

  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "confirmed"
  ).length;

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "completed"
  ).length;

  const cancelledAppointments = appointments.filter(
    (appointment) => appointment.status === "cancelled"
  ).length;

  /* ================================
     UPCOMING APPOINTMENTS
  ================================= */

  const upcomingAppointments = appointments
    .filter(
      (appointment) =>
        appointment.status === "pending" ||
        appointment.status === "confirmed"
    )
    .sort(
      (a, b) =>
        new Date(a.appointmentDate) -
        new Date(b.appointmentDate)
    );

  const nextAppointment = upcomingAppointments[0];

  /* ================================
     PATIENT INFORMATION
  ================================= */

  const patient =
    appointments[0]?.patient || null;

  const patientUser =
    patient?.user || null;

  const patientName =
    patientUser?.name || "Patient";

  const patientEmail =
    patientUser?.email || "No email available";

  const patientPhone =
    patient?.phone || "No phone available";

  const patientBloodGroup =
    patient?.bloodGroup || "Not specified";

  /* ================================
     HELPERS
  ================================= */

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getInitial = () => {
    return patientName.charAt(0).toUpperCase();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "confirmed";

      case "completed":
        return "completed";

      case "cancelled":
        return "cancelled";

      default:
        return "pending";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <FiCheckCircle />;

      case "completed":
        return <FiCheckCircle />;

      case "cancelled":
        return <FiXCircle />;

      default:
        return <FiAlertCircle />;
    }
  };

  return (
    <div className="patient-dashboard-page">

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

          <button className="active">
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
            {getInitial()}
          </div>

          <div>
            <strong>{patientName}</strong>
            <span>Patient</span>
          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="patient-dashboard-main">

        {/* Welcome */}

        <section className="patient-welcome">

          <div>

            <span className="patient-label">
              PATIENT PORTAL
            </span>

            <h1>
              Welcome back, {patientName.split(" ")[0]} 👋
            </h1>

            <p>
              Manage your appointments and keep track of
              your healthcare journey.
            </p>

          </div>

          <div className="welcome-heart">
            <FiHeart />
          </div>

        </section>

        {/* Error */}

        {error && (
          <div className="patient-error">

            <FiAlertCircle />

            <span>{error}</span>

            <button onClick={fetchAppointments}>
              Try Again
            </button>

          </div>
        )}

        {/* ================= STATS ================= */}

        <section className="patient-stats">

          <div className="patient-stat-card">

            <div className="stat-icon blue">
              <FiCalendar />
            </div>

            <div>
              <span>Total Appointments</span>
              <strong>{totalAppointments}</strong>
            </div>

          </div>

          <div className="patient-stat-card">

            <div className="stat-icon orange">
              <FiClock />
            </div>

            <div>
              <span>Pending</span>
              <strong>{pendingAppointments}</strong>
            </div>

          </div>

          <div className="patient-stat-card">

            <div className="stat-icon green">
              <FiCheckCircle />
            </div>

            <div>
              <span>Completed</span>
              <strong>{completedAppointments}</strong>
            </div>

          </div>

          <div className="patient-stat-card">

            <div className="stat-icon red">
              <FiXCircle />
            </div>

            <div>
              <span>Cancelled</span>
              <strong>{cancelledAppointments}</strong>
            </div>

          </div>

        </section>

        {/* ================= CONTENT GRID ================= */}

        <div className="patient-content-grid">

          {/* Upcoming Appointment */}

          <section className="next-appointment-card">

            <div className="section-heading">

              <div>
                <span>YOUR NEXT VISIT</span>
                <h2>Upcoming Appointment</h2>
              </div>

              <FiCalendar />

            </div>

            {loading ? (

              <div className="patient-loading">
                <div className="patient-spinner"></div>
                <p>Loading...</p>
              </div>

            ) : nextAppointment ? (

              <div className="next-appointment-content">

                <div className="next-doctor">

                  <div className="next-doctor-avatar">
                    {nextAppointment.doctor?.user?.name
                      ?.charAt(0)
                      .toUpperCase() || "D"}
                  </div>

                  <div>

                    <h3>
                      {nextAppointment.doctor?.user?.name ||
                        "Doctor"}
                    </h3>

                    <p>
                      {nextAppointment.doctor
                        ?.specialization ||
                        "Medical Specialist"}
                    </p>

                    <span>
                      {nextAppointment.doctor?.department
                        ?.name ||
                        "Department"}
                    </span>

                  </div>

                </div>

                <div className="next-appointment-details">

                  <div>
                    <FiCalendar />

                    <div>
                      <span>Date</span>

                      <strong>
                        {formatDate(
                          nextAppointment.appointmentDate
                        )}
                      </strong>
                    </div>
                  </div>

                  <div>
                    <FiClock />

                    <div>
                      <span>Time</span>

                      <strong>
                        {nextAppointment.appointmentTime ||
                          "N/A"}
                      </strong>
                    </div>
                  </div>

                </div>

                <div className="next-reason">

                  <span>Reason for Visit</span>

                  <strong>
                    {nextAppointment.reason ||
                      "General Consultation"}
                  </strong>

                </div>

                <div
                  className={`next-status ${getStatusClass(
                    nextAppointment.status
                  )}`}
                >
                  {getStatusIcon(
                    nextAppointment.status
                  )}

                  {nextAppointment.status
                    ?.charAt(0)
                    .toUpperCase() +
                    nextAppointment.status?.slice(1)}

                </div>

              </div>

            ) : (

              <div className="no-upcoming">

                <div>
                  <FiCalendar />
                </div>

                <h3>No upcoming appointments</h3>

                <p>
                  You don't have any upcoming
                  appointments.
                </p>

                <button
                  onClick={() =>
                    navigate("/patient/appointments")
                  }
                >
                  View Appointments
                  <FiArrowRight />
                </button>

              </div>

            )}

          </section>

          {/* Patient Card */}

          <section className="patient-info-panel">

            <div className="section-heading">

              <div>
                <span>MY INFORMATION</span>
                <h2>Patient Profile</h2>
              </div>

              <FiUser />

            </div>

            <div className="patient-profile-mini">

              <div className="patient-large-avatar">
                {getInitial()}
              </div>

              <div>

                <h3>{patientName}</h3>

                <p>{patientEmail}</p>

              </div>

            </div>

            <div className="patient-basic-info">

              <div>
                <span>Phone</span>
                <strong>{patientPhone}</strong>
              </div>

              <div>
                <span>Blood Group</span>
                <strong>{patientBloodGroup}</strong>
              </div>

            </div>

            <button
              className="view-profile-btn"
              onClick={() =>
                navigate("/patient/profile")
              }
            >
              View Full Profile
              <FiArrowRight />
            </button>

          </section>

        </div>

        {/* ================= RECENT APPOINTMENTS ================= */}

        <section className="recent-appointments">

          <div className="recent-header">

            <div>
              <span>APPOINTMENT HISTORY</span>
              <h2>Recent Appointments</h2>
            </div>

            <div className="recent-actions">

              <button
                className="refresh-patient-btn"
                onClick={fetchAppointments}
              >
                <FiRefreshCw />
              </button>

              <button
                className="view-all-btn"
                onClick={() =>
                  navigate("/patient/appointments")
                }
              >
                View All
                <FiArrowRight />
              </button>

            </div>

          </div>

          {loading ? (

            <div className="patient-loading">
              <div className="patient-spinner"></div>
              <p>Loading appointments...</p>
            </div>

          ) : appointments.length === 0 ? (

            <div className="patient-empty">

              <FiCalendar />

              <h3>No appointments yet</h3>

              <p>
                Your appointment history will appear here.
              </p>

            </div>

          ) : (

            <div className="recent-list">

              {appointments.slice(0, 5).map(
                (appointment) => (

                  <div
                    className="recent-appointment-row"
                    key={appointment._id}
                  >

                    <div className="recent-doctor">

                      <div className="recent-doctor-avatar">
                        {appointment.doctor?.user?.name
                          ?.charAt(0)
                          .toUpperCase() || "D"}
                      </div>

                      <div>

                        <strong>
                          {appointment.doctor?.user?.name ||
                            "Doctor"}
                        </strong>

                        <span>
                          {appointment.doctor
                            ?.specialization ||
                            "Specialist"}
                        </span>

                      </div>

                    </div>

                    <div className="recent-date">

                      <FiCalendar />

                      <span>
                        {formatDate(
                          appointment.appointmentDate
                        )}
                      </span>

                    </div>

                    <div className="recent-time">

                      <FiClock />

                      <span>
                        {appointment.appointmentTime ||
                          "N/A"}
                      </span>

                    </div>

                    <div
                      className={`recent-status ${getStatusClass(
                        appointment.status
                      )}`}
                    >
                      {getStatusIcon(
                        appointment.status
                      )}

                      {appointment.status
                        ?.charAt(0)
                        .toUpperCase() +
                        appointment.status?.slice(1)}

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>
    </div>
  );
};

export default PatientDashboard;