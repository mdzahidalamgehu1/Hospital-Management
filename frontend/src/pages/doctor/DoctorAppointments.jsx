import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaSearch,
  FaSyncAlt,
  FaClock,
  FaUser,
  FaEnvelope,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaClipboardCheck,
} from "react-icons/fa";

import api from "../../services/api";
import DoctorNavbar from "../../components/DoctorNavbar";

import "./DoctorAppointments.css";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // =========================================
  // Fetch Appointments
  // =========================================

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/appointments");

      setAppointments(
        response.data.appointments || []
      );
    } catch (error) {
      console.error(
        "Fetch doctor appointments error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load appointments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // =========================================
  // Update Appointment Status
  // =========================================

  const updateAppointmentStatus = async (
    id,
    status
  ) => {
    try {
      setUpdatingId(id);
      setError("");

      await api.put(`/appointments/${id}`, {
        status,
      });

      await fetchAppointments();
    } catch (error) {
      console.error(
        "Update appointment error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update appointment"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================================
  // Format Date
  // =========================================

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

  // =========================================
  // Get Status Class
  // =========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "appointment-status-pending";

      case "confirmed":
        return "appointment-status-confirmed";

      case "completed":
        return "appointment-status-completed";

      case "cancelled":
        return "appointment-status-cancelled";

      default:
        return "";
    }
  };

  // =========================================
  // Filter Appointments
  // =========================================

  const filteredAppointments =
    appointments.filter((appointment) => {
      const patientName =
        appointment.patient?.user?.name?.toLowerCase() ||
        "";

      const patientEmail =
        appointment.patient?.user?.email?.toLowerCase() ||
        "";

      const reason =
        appointment.reason?.toLowerCase() || "";

      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        patientName.includes(searchValue) ||
        patientEmail.includes(searchValue) ||
        reason.includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        appointment.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  // =========================================
  // Status Counts
  // =========================================

  const pendingCount = appointments.filter(
    (appointment) =>
      appointment.status === "pending"
  ).length;

  const confirmedCount = appointments.filter(
    (appointment) =>
      appointment.status === "confirmed"
  ).length;

  const completedCount = appointments.filter(
    (appointment) =>
      appointment.status === "completed"
  ).length;

  const cancelledCount = appointments.filter(
    (appointment) =>
      appointment.status === "cancelled"
  ).length;

  // =========================================
  // Loading
  // =========================================

  if (loading) {
    return (
      <div className="doctor-appointments-page">
        <DoctorNavbar />

        <div className="doctor-appointments-loading">
          <div className="appointment-loading-spinner"></div>

          <p>
            Loading appointments...
          </p>
        </div>
      </div>
    );
  }

  // =========================================
  // UI
  // =========================================

  return (
    <div className="doctor-appointments-page">
      <DoctorNavbar />

      <main className="doctor-appointments-container">

        {/* =====================================
            Header
        ====================================== */}

        <div className="doctor-appointments-header">

          <div className="doctor-appointments-title">

            <div className="doctor-appointments-title-icon">
              <FaCalendarAlt />
            </div>

            <div>
              <h1>
                Appointments
              </h1>

              <p>
                Manage your patient appointments
              </p>
            </div>

          </div>

          <button
            className="doctor-appointments-refresh"
            onClick={fetchAppointments}
          >
            <FaSyncAlt />
            <span>Refresh</span>
          </button>

        </div>

        {/* =====================================
            Error
        ====================================== */}

        {error && (
          <div className="doctor-appointments-error">
            {error}
          </div>
        )}

        {/* =====================================
            Statistics
        ====================================== */}

        <div className="doctor-appointment-stats">

          {/* Pending */}

          <div className="doctor-appointment-stat-card">

            <div className="appointment-stat-icon pending">
              <FaHourglassHalf />
            </div>

            <div>
              <span>
                Pending
              </span>

              <strong>
                {pendingCount}
              </strong>
            </div>

          </div>

          {/* Confirmed */}

          <div className="doctor-appointment-stat-card">

            <div className="appointment-stat-icon confirmed">
              <FaClock />
            </div>

            <div>
              <span>
                Confirmed
              </span>

              <strong>
                {confirmedCount}
              </strong>
            </div>

          </div>

          {/* Completed */}

          <div className="doctor-appointment-stat-card">

            <div className="appointment-stat-icon completed">
              <FaCheckCircle />
            </div>

            <div>
              <span>
                Completed
              </span>

              <strong>
                {completedCount}
              </strong>
            </div>

          </div>

          {/* Cancelled */}

          <div className="doctor-appointment-stat-card">

            <div className="appointment-stat-icon cancelled">
              <FaTimesCircle />
            </div>

            <div>
              <span>
                Cancelled
              </span>

              <strong>
                {cancelledCount}
              </strong>
            </div>

          </div>

        </div>

        {/* =====================================
            Search & Filter
        ====================================== */}

        <div className="doctor-appointments-toolbar">

          <div className="doctor-appointment-search">

            <FaSearch />

            <input
              type="text"
              placeholder="Search patient, email or reason..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="doctor-appointment-filter">

            <label>
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="all">
                All Appointments
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="confirmed">
                Confirmed
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="cancelled">
                Cancelled
              </option>
            </select>

          </div>

        </div>

        {/* =====================================
            Result Count
        ====================================== */}

        <div className="doctor-appointment-result-count">

          <span>
            Showing{" "}
            <strong>
              {filteredAppointments.length}
            </strong>{" "}
            of{" "}
            <strong>
              {appointments.length}
            </strong>{" "}
            appointments
          </span>

        </div>

        {/* =====================================
            Empty State
        ====================================== */}

        {filteredAppointments.length === 0 ? (

          <div className="doctor-appointments-empty">

            <div className="appointment-empty-icon">
              <FaCalendarAlt />
            </div>

            <h2>
              {search ||
              statusFilter !== "all"
                ? "No appointments found"
                : "No appointments yet"}
            </h2>

            <p>
              {search ||
              statusFilter !== "all"
                ? "Try changing your search or filter."
                : "Patient appointments will appear here."}
            </p>

          </div>

        ) : (

          /* =====================================
             Appointment Cards
          ====================================== */

          <div className="doctor-appointments-list">

            {filteredAppointments.map(
              (appointment) => (

                <div
                  className="doctor-appointment-card"
                  key={appointment._id}
                >

                  {/* Card Header */}

                  <div className="doctor-appointment-card-header">

                    <div className="appointment-patient">

                      <div className="appointment-patient-avatar">
                        <FaUser />
                      </div>

                      <div>
                        <h2>
                          {appointment.patient?.user?.name ||
                            "Unknown Patient"}
                        </h2>

                        <p>
                          <FaEnvelope />

                          {appointment.patient?.user?.email ||
                            "No email"}
                        </p>
                      </div>

                    </div>

                    <span
                      className={`doctor-appointment-status ${getStatusClass(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>

                  </div>

                  {/* Appointment Details */}

                  <div className="doctor-appointment-details">

                    <div className="appointment-detail">

                      <div className="appointment-detail-icon">
                        <FaCalendarAlt />
                      </div>

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

                    </div>

                    <div className="appointment-detail">

                      <div className="appointment-detail-icon">
                        <FaClock />
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

                    </div>

                    <div className="appointment-detail">

                      <div className="appointment-detail-icon">
                        <FaClipboardCheck />
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

                  </div>

                  {/* Patient Information */}

                  <div className="appointment-patient-extra">

                    <div>
                      <span>
                        Phone
                      </span>

                      <strong>
                        {appointment.patient?.phone ||
                          "N/A"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Gender
                      </span>

                      <strong>
                        {appointment.patient?.gender ||
                          "N/A"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Blood Group
                      </span>

                      <strong>
                        {appointment.patient?.bloodGroup ||
                          "N/A"}
                      </strong>
                    </div>

                  </div>

                  {/* Notes */}

                  {appointment.notes && (
                    <div className="appointment-notes">

                      <span>
                        Notes
                      </span>

                      <p>
                        {appointment.notes}
                      </p>

                    </div>
                  )}

                  {/* Actions */}

                  <div className="doctor-appointment-actions">

                    {appointment.status ===
                      "pending" && (
                      <>
                        <button
                          className="appointment-action confirm"
                          disabled={
                            updatingId ===
                            appointment._id
                          }
                          onClick={() =>
                            updateAppointmentStatus(
                              appointment._id,
                              "confirmed"
                            )
                          }
                        >
                          <FaCheckCircle />

                          {updatingId ===
                          appointment._id
                            ? "Updating..."
                            : "Confirm"}
                        </button>

                        <button
                          className="appointment-action cancel"
                          disabled={
                            updatingId ===
                            appointment._id
                          }
                          onClick={() =>
                            updateAppointmentStatus(
                              appointment._id,
                              "cancelled"
                            )
                          }
                        >
                          <FaTimesCircle />
                          Cancel
                        </button>
                      </>
                    )}

                    {appointment.status ===
                      "confirmed" && (
                      <>
                        <button
                          className="appointment-action complete"
                          disabled={
                            updatingId ===
                            appointment._id
                          }
                          onClick={() =>
                            updateAppointmentStatus(
                              appointment._id,
                              "completed"
                            )
                          }
                        >
                          <FaCheckCircle />

                          {updatingId ===
                          appointment._id
                            ? "Updating..."
                            : "Mark Completed"}
                        </button>

                        <button
                          className="appointment-action cancel"
                          disabled={
                            updatingId ===
                            appointment._id
                          }
                          onClick={() =>
                            updateAppointmentStatus(
                              appointment._id,
                              "cancelled"
                            )
                          }
                        >
                          <FaTimesCircle />
                          Cancel
                        </button>
                      </>
                    )}

                    {appointment.status ===
                      "completed" && (
                      <div className="appointment-completed-message">
                        <FaCheckCircle />
                        Appointment Completed
                      </div>
                    )}

                    {appointment.status ===
                      "cancelled" && (
                      <div className="appointment-cancelled-message">
                        <FaTimesCircle />
                        Appointment Cancelled
                      </div>
                    )}

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </main>
    </div>
  );
};

export default DoctorAppointments;