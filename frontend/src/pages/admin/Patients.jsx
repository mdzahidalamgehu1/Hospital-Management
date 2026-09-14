import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const Patients = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/patients");

      setPatients(response.data.patients || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to fetch patients"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const deletePatient = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmDelete) return;

    try {
      setMessage("");
      setError("");

      const response = await api.delete(`/patients/${id}`);

      setMessage(
        response.data.message ||
          "Patient deleted successfully"
      );

      fetchPatients();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete patient"
      );
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <main className="dashboard">

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <h1>Patients</h1>
              <p>Manage hospital patients</p>
            </div>

            <button
              onClick={() =>
                navigate("/admin/patients/create")
              }
            >
              + Create Patient
            </button>
          </div>

          {message && (
            <p style={{ color: "green" }}>
              {message}
            </p>
          )}

          {error && (
            <p style={{ color: "red" }}>
              {error}
            </p>
          )}

          {loading ? (
            <p>Loading patients...</p>
          ) : patients.length === 0 ? (
            <p>No patients found.</p>
          ) : (
            <div className="patients-list">

              {patients.map((patient) => (
                <div
                  className="card"
                  key={patient._id}
                  style={{
                    marginBottom: "20px",
                  }}
                >

                  <h2>
                    {patient.user?.name || "N/A"}
                  </h2>

                  <p>
                    <strong>Email:</strong>{" "}
                    {patient.user?.email || "N/A"}
                  </p>

                  <p>
                    <strong>Date of Birth:</strong>{" "}
                    {patient.dateOfBirth
                      ? new Date(
                          patient.dateOfBirth
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>

                  <p>
                    <strong>Gender:</strong>{" "}
                    {patient.gender || "N/A"}
                  </p>

                  <p>
                    <strong>Blood Group:</strong>{" "}
                    {patient.bloodGroup || "N/A"}
                  </p>

                  <p>
                    <strong>Phone:</strong>{" "}
                    {patient.phone || "N/A"}
                  </p>

                  <p>
                    <strong>Address:</strong>{" "}
                    {patient.address || "N/A"}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {patient.status || "N/A"}
                  </p>

                  <button
                    onClick={() =>
                      deletePatient(patient._id)
                    }
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    Delete
                  </button>

                </div>
              ))}

            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Patients;