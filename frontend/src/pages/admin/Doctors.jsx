import { useEffect, useState } from "react";
import api from "../../services/api";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const response = await api.get("/doctors");

      setDoctors(response.data.doctors || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to fetch doctors"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this doctor?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/doctors/${id}`);

      setMessage("Doctor deleted successfully");

      fetchDoctors();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to delete doctor"
      );
    }
  };

  return (
    <div className="page-container">
      <h1>Doctor Management</h1>

      {message && <p>{message}</p>}

      {loading ? (
        <p>Loading doctors...</p>
      ) : doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Specialization</th>
              <th>Department</th>
              <th>Experience</th>
              <th>Fee</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor._id}>
                <td>{doctor.user?.name || "N/A"}</td>

                <td>{doctor.user?.email || "N/A"}</td>

                <td>
                  {doctor.specialization || "N/A"}
                </td>

                <td>
                  {doctor.department?.name || "N/A"}
                </td>

                <td>
                  {doctor.experience} years
                </td>

                <td>
                  ₹{doctor.consultationFee}
                </td>

                <td>{doctor.status}</td>

                <td>
                  <button
                    onClick={() =>
                      handleDelete(doctor._id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Doctors;