import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const Patient = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    address: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelationship: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await api.post("/patients", {
        user: formData.user,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        phone: formData.phone,
        address: formData.address,
        emergencyContact: {
          name: formData.emergencyName,
          phone: formData.emergencyPhone,
          relationship: formData.emergencyRelationship
        }
      });

      setMessage(
        response.data.message || "Patient created successfully"
      );

      setTimeout(() => {
        navigate("/admin/patients");
      }, 1000);

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create patient"
      );
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <main className="dashboard">
          <h1>Create Patient</h1>

          <p>Add a new patient profile.</p>

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

          <form onSubmit={handleSubmit} className="card">

            {/* User ID */}
            <div>
              <label>User ID</label>

              <input
                type="text"
                name="user"
                value={formData.user}
                onChange={handleChange}
                placeholder="Enter User ID"
                required
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label>Date of Birth</label>

              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label>Gender</label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Blood Group */}
            <div>
              <label>Blood Group</label>

              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                required
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <label>Phone</label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label>Address</label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                required
              />
            </div>

            <h3>Emergency Contact</h3>

            {/* Emergency Name */}
            <div>
              <label>Name</label>

              <input
                type="text"
                name="emergencyName"
                value={formData.emergencyName}
                onChange={handleChange}
                placeholder="Emergency contact name"
                required
              />
            </div>

            {/* Emergency Phone */}
            <div>
              <label>Phone</label>

              <input
                type="text"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleChange}
                placeholder="Emergency contact phone"
                required
              />
            </div>

            {/* Relationship */}
            <div>
              <label>Relationship</label>

              <input
                type="text"
                name="emergencyRelationship"
                value={formData.emergencyRelationship}
                onChange={handleChange}
                placeholder="Brother / Sister / Father"
                required
              />
            </div>

            <button type="submit">
              Create Patient
            </button>

          </form>
        </main>
      </div>
    </div>
  );
};

export default Patient;