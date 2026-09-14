import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiActivity,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiSearch,
  FiRefreshCw,
  FiArrowLeft,
} from "react-icons/fi";

import api from "../../services/api";
import "./PatientAppointments.css";

const PatientAppointments = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  // ================================
  // FETCH APPOINTMENTS
  // ================================

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/appointments");

      setAppointments(response.data.appointments || []);
    } catch (err) {
      console.error("Fetch appointments error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load appointments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ================================
  // CANCEL APPOINTMENT
  // ================================

  const cancelAppointment = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) return;

    try {
      setCancellingId(id);

      await api.put(`/appointments/${id}`, {
        status: "cancelled",
      });

      await fetchAppointments();
    } catch (err) {
      console.error("Cancel appointment error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to cancel appointment"
      );
    } finally {
      setCancellingId(null);
    }
  };

  // ================================
  // FILTER
  // ================================

  const filteredAppointments = appointments.filter(
    (appointment) => {
      const doctorName =
        appointment.doctor?.user?.name || "";

      const specialization =
        appointment.doctor?.specialization || "";

      const reason =
        appointment.reason || "";

      const searchText =
        `${doctorName} ${specialization} ${reason}`.toLowerCase();

      const matchesSearch =
        searchText.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        appointment.status === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  // ================================
  // HELPERS
  // ================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusIcon = (status) => {
    if (status === "confirmed") {
      return <FiCheckCircle />;
    }

    if (status === "completed") {
      return <FiCheckCircle />;
    }

    if (status === "cancelled") {
      return <FiXCircle />;
    }

    return <FiAlertCircle />;
  };

  const getStatusClass = (status) => {
    return status || "pending";
  };

  // ================================
  // COUNTS
  // ================================

  const allCount = appointments.length;

  const pendingCount = appointments.filter(
    (item) => item.status === "pending"
  ).length;

  const confirmedCount = appointments.filter(
    (item) => item.status === "confirmed"
  ).length;

  const completedCount = appointments.filter(
    (item) => item.status === "completed"
  ).length;

  return (
    <div className="patient-appointments-page">

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

          <button className="active">
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

      <main className="patient-appointments-main">

        {/* HEADER */}

        <div className="appointments-page-header">

          <div>

            <button
              className="back-dashboard"
              onClick={() => navigate("/patient")}
            >
              <FiArrowLeft />
              Dashboard
            </button>

            <span className="appointments-label">
              PATIENT PORTAL
            </span>

            <h1>My Appointments</h1>

            <p>
              View and manage all your healthcare
              appointments.
            </p>

          </div>

          <button
            className="book-appointment-btn"
            onClick={() =>
              navigate("/patient/book-appointment")
            }
          >
            <FiCalendar />
            Book Appointment
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div className="appointments-error">

            <FiAlertCircle />

            <span>{error}</span>

            <button onClick={fetchAppointments}>
              Try Again
            </button>

          </div>
        )}

        {/* ================= STATS ================= */}

        <div className="appointment-tabs">

          <button
            className={
              statusFilter === "all"
                ? "selected"
                : ""
            }
            onClick={() => setStatusFilter("all")}
          >
            <span>All</span>
            <strong>{allCount}</strong>
          </button>

          <button
            className={
              statusFilter === "pending"
                ? "selected"
                : ""
            }
            onClick={() =>
              setStatusFilter("pending")
            }
          >
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </button>

          <button
            className={
              statusFilter === "confirmed"
                ? "selected"
                : ""
            }
            onClick={() =>
              setStatusFilter("confirmed")
            }
          >
            <span>Confirmed</span>
            <strong>{confirmedCount}</strong>
          </button>

          <button
            className={
              statusFilter === "completed"
                ? "selected"
                : ""
            }
            onClick={() =>
              setStatusFilter("completed")
            }
          >
            <span>Completed</span>
            <strong>{completedCount}</strong>
          </button>

        </div>

        {/* ================= SEARCH ================= */}

        <div className="appointments-toolbar">

          <div className="appointment-search">

            <FiSearch />

            <input
              type="text"
              placeholder="Search doctor, specialization or reason..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <button
            className="appointment-refresh"
            onClick={fetchAppointments}
          >
            <FiRefreshCw />
            Refresh
          </button>

        </div>

        {/* ================= APPOINTMENTS ================= */}

        <section className="appointments-list">

          {loading ? (

            <div className="appointments-loading">

              <div className="appointment-spinner"></div>

              <p>Loading appointments...</p>

            </div>

          ) : filteredAppointments.length === 0 ? (

            <div className="appointments-empty">

              <div>
                <FiCalendar />
              </div>

              <h3>
                {appointments.length === 0
                  ? "No appointments yet"
                  : "No matching appointments"}
              </h3>

              <p>
                {appointments.length === 0
                  ? "Your appointments will appear here."
                  : "Try changing your search or filter."}
              </p>

            </div>

          ) : (

            filteredAppointments.map(
              (appointment) => (

                <div
                  className="appointment-card"
                  key={appointment._id}
                >

                  {/* DOCTOR */}

                  <div className="appointment-doctor">

                    <div className="appointment-doctor-avatar">

                      {appointment.doctor?.user?.name
                        ?.charAt(0)
                        .toUpperCase() || "D"}

                    </div>

                    <div>

                      <h3>
                        {appointment.doctor?.user?.name ||
                          "Doctor"}
                      </h3>

                      <p>
                        {appointment.doctor
                          ?.specialization ||
                          "Medical Specialist"}
                      </p>

                      <span>
                        {appointment.doctor?.department
                          ?.name ||
                          "Department"}
                      </span>

                    </div>

                  </div>

                  {/* DETAILS */}

                  <div className="appointment-details">

                    <div>

                      <FiCalendar />

                      <div>
                        <span>Date</span>

                        <strong>
                          {formatDate(
                            appointment.appointmentDate
                          )}
                        </strong>
                      </div>

                    </div>

                    <div>

                      <FiClock />

                      <div>
                        <span>Time</span>

                        <strong>
                          {appointment.appointmentTime ||
                            "N/A"}
                        </strong>
                      </div>

                    </div>

                  </div>

                  {/* REASON */}

                  <div className="appointment-reason">

                    <span>Reason for Visit</span>

                    <strong>
                      {appointment.reason ||
                        "General Consultation"}
                    </strong>

                  </div>

                  {/* STATUS */}

                  <div className="appointment-card-right">

                    <div
                      className={`appointment-status ${getStatusClass(
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

                    {(appointment.status ===
                      "pending" ||
                      appointment.status ===
                        "confirmed") && (

                      <button
                        className="cancel-appointment-btn"
                        disabled={
                          cancellingId ===
                          appointment._id
                        }
                        onClick={() =>
                          cancelAppointment(
                            appointment._id
                          )
                        }
                      >
                        <FiXCircle />

                        {cancellingId ===
                        appointment._id
                          ? "Cancelling..."
                          : "Cancel"}
                      </button>

                    )}

                  </div>

                </div>

              )
            )

          )}

        </section>

      </main>

    </div>
  );
};

export default PatientAppointments;