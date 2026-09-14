import { useEffect, useState } from "react";
import {
  FiUsers,
  FiUserPlus,
  FiCalendar,
  FiClock,
  FiArrowRight,
  FiPlus,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import AdminSidebar from "../../components/AdminSidebar";
import AdminNavbar from "../../components/AdminNavbar";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    appointments: 0,
    pending: 0,
  });

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [doctorsRes, patientsRes, appointmentsRes] =
        await Promise.all([
          api.get("/doctors"),
          api.get("/patients"),
          api.get("/appointments"),
        ]);

      const doctors = doctorsRes.data.doctors || [];
      const patients = patientsRes.data.patients || [];
      const appointmentData =
        appointmentsRes.data.appointments || [];

      const pendingAppointments = appointmentData.filter(
        (appointment) =>
          appointment.status === "pending"
      );

      setStats({
        doctors: doctors.length,
        patients: patients.length,
        appointments: appointmentData.length,
        pending: pendingAppointments.length,
      });

      setAppointments(appointmentData.slice(0, 5));
    } catch (error) {
      console.error(
        "Failed to fetch dashboard data:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-main">

        <AdminNavbar />

        <main className="dashboard">

          {/* Header */}

          <div className="dashboard-welcome">

            <div>
              <h1>Good morning, Administrator 👋</h1>

              <p>
                Here's what's happening in your hospital today.
              </p>
            </div>

            <button
              className="dashboard-primary-btn"
              onClick={() =>
                navigate("/admin/appointments")
              }
            >
              <FiCalendar />
              View Appointments
            </button>

          </div>

          {/* Statistics */}

          <div className="dashboard-stats">

            <div className="dashboard-stat-card">

              <div className="stat-icon blue">
                <FiUserPlus />
              </div>

              <div>
                <p>Total Doctors</p>

                <h2>
                  {loading ? "—" : stats.doctors}
                </h2>

                <span>Registered doctors</span>
              </div>

            </div>

            <div className="dashboard-stat-card">

              <div className="stat-icon green">
                <FiUsers />
              </div>

              <div>
                <p>Total Patients</p>

                <h2>
                  {loading ? "—" : stats.patients}
                </h2>

                <span>Registered patients</span>
              </div>

            </div>

            <div className="dashboard-stat-card">

              <div className="stat-icon purple">
                <FiCalendar />
              </div>

              <div>
                <p>Appointments</p>

                <h2>
                  {loading ? "—" : stats.appointments}
                </h2>

                <span>Total appointments</span>
              </div>

            </div>

            <div className="dashboard-stat-card">

              <div className="stat-icon orange">
                <FiClock />
              </div>

              <div>
                <p>Pending</p>

                <h2>
                  {loading ? "—" : stats.pending}
                </h2>

                <span>Need attention</span>
              </div>

            </div>

          </div>

          {/* Main dashboard area */}

          <div className="dashboard-grid">

            {/* Appointments */}

            <div className="dashboard-panel">

              <div className="panel-header">

                <div>
                  <h2>Recent Appointments</h2>

                  <p>
                    Latest appointments in the hospital
                  </p>
                </div>

                <button
                  className="view-all-btn"
                  onClick={() =>
                    navigate("/admin/appointments")
                  }
                >
                  View all
                  <FiArrowRight />
                </button>

              </div>

              {loading ? (
                <div className="dashboard-empty">
                  Loading appointments...
                </div>
              ) : appointments.length === 0 ? (
                <div className="dashboard-empty">
                  No appointments found.
                </div>
              ) : (
<div className="appointment-list">

  {appointments.map((appointment) => (

    <div
      className="appointment-row"
      key={appointment._id}
    >

      {/* PATIENT */}

      <div className="appointment-person">

        <div className="appointment-avatar">
          {appointment.patient?.user?.name
            ?.charAt(0)
            ?.toUpperCase() || "P"}
        </div>

        <div className="appointment-person-info">

          <span className="appointment-doctor-label">
            Patient
          </span>

          <strong>
            {appointment.patient?.user?.name ||
              "Unknown Patient"}
          </strong>

          <span>
            {appointment.patient?.user?.email ||
              "No email"}
          </span>

        </div>

      </div>


      {/* DOCTOR */}

      <div className="appointment-doctor">

        <span className="appointment-doctor-label">
          Assigned Doctor
        </span>

        <strong>
          Dr.{" "}
          {appointment.doctor?.user?.name ||
            "Unknown Doctor"}
        </strong>

        <span>
          {appointment.doctor?.specialization ||
            "Specialization not available"}
        </span>

      </div>


      {/* DATE */}

      <div className="appointment-date">

        <strong>
          {appointment.appointmentDate
            ? new Date(
                appointment.appointmentDate
              ).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "N/A"}
        </strong>

        <span>
          {appointment.appointmentTime || "N/A"}
        </span>

      </div>


      {/* STATUS */}

      <span
        className={`appointment-status ${appointment.status}`}
      >
        {appointment.status}
      </span>

    </div>

  ))}

</div>
              )}

            </div>

            {/* Quick Actions */}

            <div className="dashboard-panel quick-panel">

              <div className="panel-header">

                <div>
                  <h2>Quick Actions</h2>

                  <p>Common administrative tasks</p>
                </div>

              </div>

              <div className="quick-actions">

                <button
                  onClick={() =>
                    navigate("/admin/doctors")
                  }
                >
                  <div className="quick-icon blue">
                    <FiUserPlus />
                  </div>

                  <div>
                    <strong>Manage Doctors</strong>
                    <span>
                      Add or manage doctors
                    </span>
                  </div>

                  <FiArrowRight />
                </button>

                <button
                  onClick={() =>
                    navigate("/admin/patients/create")
                  }
                >
                  <div className="quick-icon green">
                    <FiUsers />
                  </div>

                  <div>
                    <strong>Add Patient</strong>
                    <span>
                      Register a new patient
                    </span>
                  </div>

                  <FiArrowRight />
                </button>

                <button
                  onClick={() =>
                    navigate("/admin/appointments")
                  }
                >
                  <div className="quick-icon purple">
                    <FiCalendar />
                  </div>

                  <div>
                    <strong>Appointments</strong>
                    <span>
                      Manage appointments
                    </span>
                  </div>

                  <FiArrowRight />
                </button>

                <button
                  onClick={() =>
                    navigate("/admin/departments")
                  }
                >
                  <div className="quick-icon orange">
                    <FiPlus />
                  </div>

                  <div>
                    <strong>Departments</strong>
                    <span>
                      Manage departments
                    </span>
                  </div>

                  <FiArrowRight />
                </button>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
};

export default AdminDashboard;