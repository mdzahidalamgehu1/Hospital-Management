import { useEffect, useState } from "react";
import api from "../../services/api";
import PatientNavbar from "../../components/PatientNavbar";
import "./PatientProfile.css";

const PatientProfile = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    address: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
  });

  // =========================
  // GET PATIENT PROFILE
  // =========================
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get("/patients/me");

      const patientData = response.data.patient;

      setPatient(patientData);

      setFormData({
        dateOfBirth: patientData.dateOfBirth
          ? patientData.dateOfBirth.split("T")[0]
          : "",

        gender: patientData.gender || "",
        bloodGroup: patientData.bloodGroup || "",
        phone: patientData.phone || "",
        address: patientData.address || "",

        emergencyName:
          patientData.emergencyContact?.name || "",

        emergencyPhone:
          patientData.emergencyContact?.phone || "",

        // IMPORTANT:
        // Backend uses "relationship"
        emergencyRelation:
          patientData.emergencyContact?.relationship || "",
      });
    } catch (error) {
      console.error("Fetch patient profile error:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to fetch profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // UPDATE PROFILE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      await api.put("/patients/me", {
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        phone: formData.phone,
        address: formData.address,

        emergencyContact: {
          name: formData.emergencyName,
          phone: formData.emergencyPhone,

          // IMPORTANT:
          // Backend expects "relationship"
          relationship: formData.emergencyRelation,
        },
      });

      setMessage("Profile updated successfully");

      setEditing(false);

      await fetchProfile();
    } catch (error) {
      console.error("Update profile error:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="patient-page">
        <PatientNavbar />

        <p className="page-loading">
          Loading profile...
        </p>
      </div>
    );
  }

  // =========================
  // PROFILE NOT FOUND
  // =========================
  if (!patient) {
    return (
      <div className="patient-page">
        <PatientNavbar />

        <p className="page-error">
          {message || "Profile not found"}
        </p>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================
  return (
    <div className="patient-page">
      <PatientNavbar />

      <main className="patient-container">

        {/* HEADER */}
        <div className="profile-header">
          <div>
            <h1>My Profile</h1>

            <p>
              Manage your personal and medical information.
            </p>
          </div>

          <button
            type="button"
            className="profile-edit-btn"
            onClick={() => {
              setEditing(!editing);
              setMessage("");
            }}
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="profile-message">
            {message}
          </div>
        )}

        {/* =========================
            VIEW PROFILE
        ========================= */}
        {!editing ? (
          <div className="profile-grid">

            {/* PERSONAL INFORMATION */}
            <section className="profile-card">
              <h2>Personal Information</h2>

              <div className="profile-info">

                <div>
                  <span>Full Name</span>

                  <strong>
                    {patient.user?.name || "N/A"}
                  </strong>
                </div>

                <div>
                  <span>Email</span>

                  <strong>
                    {patient.user?.email || "N/A"}
                  </strong>
                </div>

                <div>
                  <span>Phone</span>

                  <strong>
                    {patient.phone || "N/A"}
                  </strong>
                </div>

                <div>
                  <span>Date of Birth</span>

                  <strong>
                    {patient.dateOfBirth
                      ? new Date(
                          patient.dateOfBirth
                        ).toLocaleDateString()
                      : "N/A"}
                  </strong>
                </div>

                <div>
                  <span>Gender</span>

                  <strong>
                    {patient.gender || "N/A"}
                  </strong>
                </div>

                <div>
                  <span>Blood Group</span>

                  <strong>
                    {patient.bloodGroup || "N/A"}
                  </strong>
                </div>

              </div>
            </section>

            {/* ADDRESS */}
            <section className="profile-card">
              <h2>Address</h2>

              <div className="single-info">
                <span>Residential Address</span>

                <strong>
                  {patient.address || "N/A"}
                </strong>
              </div>
            </section>

            {/* EMERGENCY CONTACT */}
            <section className="profile-card">
              <h2>Emergency Contact</h2>

              <div className="profile-info">

                <div>
                  <span>Name</span>

                  <strong>
                    {patient.emergencyContact?.name ||
                      "N/A"}
                  </strong>
                </div>

                <div>
                  <span>Phone</span>

                  <strong>
                    {patient.emergencyContact?.phone ||
                      "N/A"}
                  </strong>
                </div>

                <div>
                  <span>Relationship</span>

                  <strong>
                    {patient.emergencyContact?.relationship ||
                      "N/A"}
                  </strong>
                </div>

                <div>
                  <span>Account Status</span>

                  <strong className="status-active">
                    {patient.status || "active"}
                  </strong>
                </div>

              </div>
            </section>

          </div>
        ) : (

          /* =========================
             EDIT PROFILE
          ========================= */
          <form
            className="profile-edit-form"
            onSubmit={handleSubmit}
          >

            {/* PERSONAL INFORMATION */}
            <section className="profile-card">
              <h2>Edit Personal Information</h2>

              <div className="form-grid">

                {/* DOB */}
                <div className="form-group">
                  <label>Date of Birth</label>

                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>

                {/* GENDER */}
                <div className="form-group">
                  <label>Gender</label>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select Gender
                    </option>

                    <option value="male">
                      Male
                    </option>

                    <option value="female">
                      Female
                    </option>

                    <option value="other">
                      Other
                    </option>
                  </select>
                </div>

                {/* BLOOD GROUP */}
                <div className="form-group">
                  <label>Blood Group</label>

                  <input
                    type="text"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    placeholder="Example: B+"
                  />
                </div>

                {/* PHONE */}
                <div className="form-group">
                  <label>Phone</label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>

                {/* ADDRESS */}
                <div className="form-group full-width">
                  <label>Address</label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter your address"
                  />
                </div>

              </div>
            </section>

            {/* EMERGENCY CONTACT */}
            <section className="profile-card">
              <h2>Emergency Contact</h2>

              <div className="form-grid">

                {/* NAME */}
                <div className="form-group">
                  <label>Contact Name</label>

                  <input
                    type="text"
                    name="emergencyName"
                    value={formData.emergencyName}
                    onChange={handleChange}
                    placeholder="Example: Rahul"
                  />
                </div>

                {/* PHONE */}
                <div className="form-group">
                  <label>Contact Phone</label>

                  <input
                    type="text"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>

                {/* RELATIONSHIP */}
                <div className="form-group">
                  <label>Relationship</label>

                  <input
                    type="text"
                    name="emergencyRelation"
                    value={formData.emergencyRelation}
                    onChange={handleChange}
                    placeholder="Example: Father"
                  />
                </div>

              </div>
            </section>

            {/* SAVE BUTTON */}
            <button
              type="submit"
              className="save-profile-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </form>
        )}

      </main>
    </div>
  );
};

export default PatientProfile;