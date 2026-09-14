import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });

  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", formData);

      setMessage("Registration successful");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
  //   } catch (error) {
  //     setMessage(
  //       error.response?.data?.message ||
  //         "Registration failed"
  //     );
  //   }
  // };
  } catch (error) {
  console.log("========== REGISTER ERROR ==========");
  console.log("Error:", error);
  console.log("Message:", error.message);
  console.log("Code:", error.code);
  console.log("Response:", error.response);
  console.log("Response Data:", error.response?.data);
  console.log("Request:", error.request);

  setMessage(
    error.response?.data?.message ||
    error.message ||
    "Registration failed"
  );
} finally {
  setLoading(false);
}

  return (
    <div>
      <h1>Create Account</h1>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        <button type="submit">
          Register
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;