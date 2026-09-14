import { useEffect, useState } from "react";
import {
  FaUserMd,
  FaUsers,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaArrowRight,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import api from "../../services/api";
import DoctorNavbar from "../../components/DoctorNavbar";

import "./DoctorDashboard.css";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH DOCTOR DASHBOARD DATA
  // =====================================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [appointmentsResponse, patientsResponse] =
        await Promise.all([
          api.get("/appointments"),
          api.get("/appointments/doctor/patients"),
        ]);

      setAppointments(
        appointmentsResponse.data.appointments || []
      );

      setPatients(
        patientsResponse.data.patients || []
      );
    } catch (error) {
      console.error(
        "Doctor dashboard error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // =====================================================
  // APPOINTMENT COUNTS
  // =====================================================

  const pendingAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "pending"
  ).length;

  const confirmedAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "confirmed"
  ).length;

  const completedAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "completed"
  ).length;

  const cancelledAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "cancelled"
  ).length;

  // =====================================================
  // TODAY'S APPOINTMENTS
  // =====================================================

  const today = new Date();

  const todayAppointments = appointments.filter(
    (appointment) => {
      const appointmentDate = new Date(
        appointment.appointmentDate
      );

      return (
        appointmentDate.toDateString() ===
        today.toDateString()
      );
    }
  );

  // =====================================================
  // UPCOMING APPOINTMENTS
  // =====================================================

  const upcomingAppointments = appointments
    .filter((appointment) => {
      const appointmentDate = new Date(
        appointment.appointmentDate
      );

      return (
        appointmentDate >= today &&
        appointment.status !== "cancelled" &&
        appointment.status !== "completed"
      );
    })
    .sort(
      (a, b) =>
        new Date(a.appointmentDate) -
        new Date(b.appointmentDate)
    );

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // GET STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "status-pending";

      case "confirmed":
        return "status-confirmed";

      case "completed":
        return "status-completed";

      case "cancelled":
        return "status-cancelled";

      default:
        return "";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="doctor-dashboard-page">

        <DoctorNavbar />

        <div className="doctor-dashboard-loading">
          Loading dashboard...
        </div>

      </div>
    );
  }

  return (
    <div className="doctor-dashboard-page">

      {/* =================================================
          COMMON DOCTOR NAVBAR
      ================================================= */}

      <DoctorNavbar />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="doctor-dashboard-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="doctor-dashboard-header">

          <div>

            <div className="doctor-dashboard-title">

              <div className="doctor-dashboard-icon">
                <FaUserMd />
              </div>

              <div>

                <h1>
                  Doctor Dashboard
                </h1>

                <p>
                  Manage your patients and appointments
                </p>

              </div>

            </div>

          </div>

          <Link
            to="/doctor/appointments"
            className="doctor-view-appointments-btn"
          >
            <FaCalendarAlt />
            View Appointments
          </Link>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="doctor-dashboard-error">
            {error}
          </div>
        )}


        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="doctor-dashboard-stats">

          {/* Total Patients */}

          <div className="doctor-stat-card">

            <div className="doctor-stat-icon patients">
              <FaUsers />
            </div>

            <div className="doctor-stat-content">

              <span>
                Total Patients
              </span>

              <strong>
                {patients.length}
              </strong>

            </div>

          </div>


          {/* Today's Appointments */}

          <div className="doctor-stat-card">

            <div className="doctor-stat-icon appointments">
              <FaCalendarAlt />
            </div>

            <div className="doctor-stat-content">

              <span>
                Today's Appointments
              </span>

              <strong>
                {todayAppointments.length}
              </strong>

            </div>

          </div>


          {/* Pending */}

          <div className="doctor-stat-card">

            <div className="doctor-stat-icon pending">
              <FaHourglassHalf />
            </div>

            <div className="doctor-stat-content">

              <span>
                Pending
              </span>

              <strong>
                {pendingAppointments}
              </strong>

            </div>

          </div>


          {/* Completed */}

          <div className="doctor-stat-card">

            <div className="doctor-stat-icon completed">
              <FaCheckCircle />
            </div>

            <div className="doctor-stat-content">

              <span>
                Completed
              </span>

              <strong>
                {completedAppointments}
              </strong>

            </div>

          </div>

        </div>


        {/* =================================================
            APPOINTMENT OVERVIEW
        ================================================= */}

        <section className="doctor-overview-section">

          <div className="doctor-section-header">

            <div>

              <h2>
                Appointment Overview
              </h2>

              <p>
                Current appointment status
              </p>

            </div>

          </div>


          <div className="doctor-appointment-overview">

            {/* Pending */}

            <div className="doctor-overview-card">

              <div className="overview-card-icon pending">
                <FaHourglassHalf />
              </div>

              <div>

                <span>
                  Pending
                </span>

                <strong>
                  {pendingAppointments}
                </strong>

              </div>

            </div>


            {/* Confirmed */}

            <div className="doctor-overview-card">

              <div className="overview-card-icon confirmed">
                <FaClock />
              </div>

              <div>

                <span>
                  Confirmed
                </span>

                <strong>
                  {confirmedAppointments}
                </strong>

              </div>

            </div>


            {/* Completed */}

            <div className="doctor-overview-card">

              <div className="overview-card-icon completed">
                <FaCheckCircle />
              </div>

              <div>

                <span>
                  Completed
                </span>

                <strong>
                  {completedAppointments}
                </strong>

              </div>

            </div>


            {/* Cancelled */}

            <div className="doctor-overview-card">

              <div className="overview-card-icon cancelled">
                <FaTimesCircle />
              </div>

              <div>

                <span>
                  Cancelled
                </span>

                <strong>
                  {cancelledAppointments}
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            TODAY'S APPOINTMENTS
        ================================================= */}

        <section className="doctor-dashboard-section">

          <div className="doctor-section-header">

            <div>

              <h2>
                Today's Appointments
              </h2>

              <p>
                Appointments scheduled for today
              </p>

            </div>

            <Link
              to="/doctor/appointments"
              className="doctor-section-link"
            >
              View All
              <FaArrowRight />
            </Link>

          </div>


          {todayAppointments.length === 0 ? (

            <div className="doctor-empty-state">

              <FaCalendarAlt />

              <h3>
                No appointments today
              </h3>

              <p>
                You don't have any appointments
                scheduled for today.
              </p>

            </div>

          ) : (

            <div className="doctor-appointments-list">

              {todayAppointments
                .slice(0, 5)
                .map((appointment) => (

                  <div
                    className="doctor-appointment-card"
                    key={appointment._id}
                  >

                    <div className="appointment-patient-info">

                      <div className="appointment-patient-icon">
                        <FaUsers />
                      </div>

                      <div>

                        <h3>
                          {appointment.patient?.user?.name ||
                            "Unknown Patient"}
                        </h3>

                        <p>
                          {appointment.patient?.user?.email ||
                            "No email"}
                        </p>

                      </div>

                    </div>


                    <div className="appointment-details">

                      <div>
                        <span>
                          Date
                        </span>

                        <strong>
                          {formatDate(
                            appointment.appointmentDate
                          )}
                        </strong>
                      </div>


                      <div>
                        <span>
                          Time
                        </span>

                        <strong>
                          {appointment.appointmentTime ||
                            "N/A"}
                        </strong>
                      </div>


                      <div>
                        <span>
                          Reason
                        </span>

                        <strong>
                          {appointment.reason ||
                            "General Consultation"}
                        </strong>
                      </div>

                    </div>


                    <span
                      className={`doctor-status-badge ${getStatusClass(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>

                  </div>

                ))}

            </div>

          )}

        </section>


        {/* =================================================
            UPCOMING APPOINTMENTS
        ================================================= */}

        <section className="doctor-dashboard-section">

          <div className="doctor-section-header">

            <div>

              <h2>
                Upcoming Appointments
              </h2>

              <p>
                Your next scheduled appointments
              </p>

            </div>

            <Link
              to="/doctor/appointments"
              className="doctor-section-link"
            >
              View All
              <FaArrowRight />
            </Link>

          </div>


          {upcomingAppointments.length === 0 ? (

            <div className="doctor-empty-state">

              <FaCalendarAlt />

              <h3>
                No upcoming appointments
              </h3>

              <p>
                You don't have any upcoming
                appointments.
              </p>

            </div>

          ) : (

            <div className="doctor-upcoming-list">

              {upcomingAppointments
                .slice(0, 5)
                .map((appointment) => (

                  <div
                    className="doctor-upcoming-card"
                    key={appointment._id}
                  >

                    <div className="upcoming-date">

                      <span>
                        {new Date(
                          appointment.appointmentDate
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                          }
                        )}
                      </span>

                      <small>
                        {new Date(
                          appointment.appointmentDate
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            month: "short",
                          }
                        )}
                      </small>

                    </div>


                    <div className="upcoming-patient">

                      <h3>
                        {appointment.patient?.user?.name ||
                          "Unknown Patient"}
                      </h3>

                      <p>
                        {appointment.reason ||
                          "General Consultation"}
                      </p>

                    </div>


                    <div className="upcoming-time">

                      <FaClock />

                      <span>
                        {appointment.appointmentTime ||
                          "N/A"}
                      </span>

                    </div>


                    <span
                      className={`doctor-status-badge ${getStatusClass(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>

                  </div>

                ))}

            </div>

          )}

        </section>


        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="doctor-dashboard-section">

          <div className="doctor-section-header">

            <div>

              <h2>
                Quick Actions
              </h2>

              <p>
                Quickly access important sections
              </p>

            </div>

          </div>


          <div className="doctor-quick-actions">

            <Link
              to="/doctor/patients"
              className="doctor-quick-action"
            >

              <div className="quick-action-icon">
                <FaUsers />
              </div>

              <div>

                <h3>
                  My Patients
                </h3>

                <p>
                  View and manage your patients
                </p>

              </div>

              <FaArrowRight />

            </Link>


            <Link
              to="/doctor/appointments"
              className="doctor-quick-action"
            >

              <div className="quick-action-icon">
                <FaCalendarAlt />
              </div>

              <div>

                <h3>
                  Appointments
                </h3>

                <p>
                  Manage your appointments
                </p>

              </div>

              <FaArrowRight />

            </Link>


            <Link
              to="/doctor/profile"
              className="doctor-quick-action"
            >

              <div className="quick-action-icon">
                <FaUserMd />
              </div>

              <div>

                <h3>
                  My Profile
                </h3>

                <p>
                  Update your professional profile
                </p>

              </div>

              <FaArrowRight />

            </Link>

          </div>

        </section>

      </main>

    </div>
  );
};

export default DoctorDashboard;