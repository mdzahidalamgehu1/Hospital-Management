import { useEffect, useState } from "react";
import {
  FaUsers,
  FaSearch,
  FaSyncAlt,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaMapMarkerAlt,
  FaTint,
  FaVenusMars,
  FaUser,
} from "react-icons/fa";

import api from "../../services/api";
import DoctorNavbar from "../../components/DoctorNavbar";

import "./DoctorPatients.css";

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch doctor's patients
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/appointments/doctor/patients"
      );

      setPatients(response.data.patients || []);
    } catch (error) {
      console.error("Fetch doctor patients error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load patients"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Calculate age
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";

    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    let age =
      today.getFullYear() -
      birthDate.getFullYear();

    const monthDifference =
      today.getMonth() -
      birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Format date
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

  // Filter patients
  const filteredPatients = patients.filter(
    (patient) => {
      const name =
        patient.user?.name?.toLowerCase() || "";

      const email =
        patient.user?.email?.toLowerCase() || "";

      const phone =
        patient.phone?.toLowerCase() || "";

      const bloodGroup =
        patient.bloodGroup?.toLowerCase() || "";

      const address =
        patient.address?.toLowerCase() || "";

      const searchValue =
        search.toLowerCase();

      return (
        name.includes(searchValue) ||
        email.includes(searchValue) ||
        phone.includes(searchValue) ||
        bloodGroup.includes(searchValue) ||
        address.includes(searchValue)
      );
    }
  );

  if (loading) {
    return (
      <div className="doctor-patients-page">
        <DoctorNavbar />

        <div className="doctor-patients-loading">
          <div className="loading-spinner"></div>
          <p>Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-patients-page">
      <DoctorNavbar />

      <main className="doctor-patients-container">

        {/* Header */}
        <div className="doctor-patients-header">
          <div className="doctor-patients-title">
            <div className="doctor-patients-title-icon">
              <FaUsers />
            </div>

            <div>
              <h1>My Patients</h1>
              <p>
                View and manage patients assigned to you
              </p>
            </div>
          </div>

          <button
            className="doctor-refresh-btn"
            onClick={fetchPatients}
          >
            <FaSyncAlt />
            <span>Refresh</span>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="doctor-patients-error">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="doctor-patients-stats">

          <div className="doctor-patient-stat-card">
            <div className="patient-stat-icon">
              <FaUsers />
            </div>

            <div>
              <span>Total Patients</span>
              <strong>{patients.length}</strong>
            </div>
          </div>

          <div className="doctor-patient-stat-card">
            <div className="patient-stat-icon">
              <FaSearch />
            </div>

            <div>
              <span>Showing</span>
              <strong>
                {filteredPatients.length}
              </strong>
            </div>
          </div>

        </div>

        {/* Search */}
        <div className="doctor-patients-toolbar">

          <div className="doctor-patient-search">
            <FaSearch />

            <input
              type="text"
              placeholder="Search patients by name, email, phone..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

        </div>

        {/* Patient List */}
        {filteredPatients.length === 0 ? (
          <div className="doctor-patients-empty">

            <div className="empty-icon">
              <FaUsers />
            </div>

            <h2>
              {search
                ? "No patients found"
                : "No patients yet"}
            </h2>

            <p>
              {search
                ? "Try searching with a different name, email, or phone number."
                : "Patients assigned to you will appear here."}
            </p>

          </div>
        ) : (
          <div className="doctor-patients-grid">

            {filteredPatients.map((patient) => (
              <div
                className="doctor-patient-card"
                key={patient._id}
              >

                {/* Card Header */}
                <div className="doctor-patient-card-header">

                  <div className="doctor-patient-avatar">
                    <FaUser />
                  </div>

                  <div className="doctor-patient-name">

                    <h2>
                      {patient.user?.name ||
                        "Unknown Patient"}
                    </h2>

                    <span>
                      Patient ID:{" "}
                      {patient._id?.slice(-8) ||
                        "N/A"}
                    </span>

                  </div>

                  <span
                    className={`patient-status ${
                      patient.status === "active"
                        ? "active"
                        : "inactive"
                    }`}
                  >
                    {patient.status || "active"}
                  </span>

                </div>

                {/* Patient Details */}
                <div className="doctor-patient-details">

                  {/* Email */}
                  <div className="patient-detail-item">
                    <div className="patient-detail-icon">
                      <FaEnvelope />
                    </div>

                    <div>
                      <span>Email</span>
                      <strong>
                        {patient.user?.email ||
                          "N/A"}
                      </strong>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="patient-detail-item">
                    <div className="patient-detail-icon">
                      <FaPhone />
                    </div>

                    <div>
                      <span>Phone</span>
                      <strong>
                        {patient.phone || "N/A"}
                      </strong>
                    </div>
                  </div>

                  {/* DOB */}
                  <div className="patient-detail-item">
                    <div className="patient-detail-icon">
                      <FaBirthdayCake />
                    </div>

                    <div>
                      <span>Date of Birth</span>
                      <strong>
                        {formatDate(
                          patient.dateOfBirth
                        )}
                      </strong>
                    </div>
                  </div>

                  {/* Age / Gender */}
                  <div className="patient-detail-item">
                    <div className="patient-detail-icon">
                      <FaVenusMars />
                    </div>

                    <div>
                      <span>Age / Gender</span>
                      <strong>
                        {calculateAge(
                          patient.dateOfBirth
                        )}{" "}
                        years
                        {patient.gender
                          ? ` / ${patient.gender}`
                          : ""}
                      </strong>
                    </div>
                  </div>

                  {/* Blood Group */}
                  <div className="patient-detail-item">
                    <div className="patient-detail-icon">
                      <FaTint />
                    </div>

                    <div>
                      <span>Blood Group</span>
                      <strong>
                        {patient.bloodGroup ||
                          "N/A"}
                      </strong>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="patient-detail-item patient-address">
                    <div className="patient-detail-icon">
                      <FaMapMarkerAlt />
                    </div>

                    <div>
                      <span>Address</span>
                      <strong>
                        {patient.address ||
                          "N/A"}
                      </strong>
                    </div>
                  </div>

                </div>

                {/* Emergency Contact */}
                {patient.emergencyContact && (
                  <div className="emergency-contact">

                    <h3>
                      Emergency Contact
                    </h3>

                    <div className="emergency-contact-info">

                      <div>
                        <span>Name</span>
                        <strong>
                          {
                            patient
                              .emergencyContact
                              .name
                          }
                        </strong>
                      </div>

                      <div>
                        <span>Phone</span>
                        <strong>
                          {
                            patient
                              .emergencyContact
                              .phone
                          }
                        </strong>
                      </div>

                      <div>
                        <span>Relationship</span>
                        <strong>
                          {
                            patient
                              .emergencyContact
                              .relationship
                          }
                        </strong>
                      </div>

                    </div>

                  </div>
                )}

              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
};

export default DoctorPatients;