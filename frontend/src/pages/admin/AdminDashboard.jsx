import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    departments: 0,
    doctors: 0,
    patients: 0,
    appointments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);

      const [
        departmentsResponse,
        doctorsResponse,
        patientsResponse,
        appointmentsResponse,
      ] = await Promise.all([
        api.get("/departments"),
        api.get("/doctors"),
        api.get("/patients"),
        api.get("/appointments"),
      ]);

      setStats({
        departments:
          departmentsResponse.data.departments?.length || 0,

        doctors:
          doctorsResponse.data.doctors?.length || 0,

        patients:
          patientsResponse.data.patients?.length || 0,

        appointments:
          appointmentsResponse.data.appointments?.length || 0,
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <main className="dashboard">
          <h1>Admin Dashboard</h1>
          <p>Hospital overview</p>

          {loading && <p>Loading dashboard...</p>}

          {error && <p>{error}</p>}

          {!loading && !error && (
            <div className="dashboard-cards">
              <div className="card">
                <h3>Departments</h3>
                <p>{stats.departments}</p>
              </div>

              <div className="card">
                <h3>Doctors</h3>
                <p>{stats.doctors}</p>
              </div>

              <div className="card">
                <h3>Patients</h3>
                <p>{stats.patients}</p>
              </div>

              <div className="card">
                <h3>Appointments</h3>
                <p>{stats.appointments}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;