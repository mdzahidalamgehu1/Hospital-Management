import { useEffect, useState } from "react";
import api from "../../services/api";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/appointments");

      setAppointments(response.data.appointments || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to fetch appointments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, {
        status,
      });

      setMessage("Appointment updated successfully");
      fetchAppointments();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to update appointment"
      );
    }
  };

  const deleteAppointment = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/appointments/${id}`);

      setMessage("Appointment deleted successfully");
      fetchAppointments();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to delete appointment"
      );
    }
  };

  return (
    <div className="page-container">
      <h1>Appointment Management</h1>

      {message && <p>{message}</p>}

      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>
                  {appointment.patient?.user?.name || "N/A"}
                </td>

                <td>
                  {appointment.doctor?.user?.name || "N/A"}
                </td>

                <td>
                  {new Date(
                    appointment.appointmentDate
                  ).toLocaleDateString()}
                </td>

                <td>{appointment.appointmentTime}</td>

                <td>{appointment.reason}</td>

                <td>{appointment.status}</td>

                <td>
                  {appointment.status === "pending" && (
                    <button
                      onClick={() =>
                        updateStatus(
                          appointment._id,
                          "confirmed"
                        )
                      }
                    >
                      Confirm
                    </button>
                  )}

                  {appointment.status === "confirmed" && (
                    <button
                      onClick={() =>
                        updateStatus(
                          appointment._id,
                          "completed"
                        )
                      }
                    >
                      Complete
                    </button>
                  )}

                  <button
                    onClick={() =>
                      updateStatus(
                        appointment._id,
                        "cancelled"
                      )
                    }
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() =>
                      deleteAppointment(appointment._id)
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

export default Appointments;