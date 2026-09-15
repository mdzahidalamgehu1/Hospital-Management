import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserMd,
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserShield,
  FaArrowRight,
  FaEye,
  FaEyeSlash,
  FaHeartbeat,
  FaCheckCircle,
} from "react-icons/fa";

import api from "../services/api";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setMessage("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      await api.post("/auth/register", formData);

      setMessage("Registration successful");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-right">

        <div className="register-card">

          {/* HEADER */}

          <div className="register-header">

            <div className="mobile-register-logo">
              <div>
                <FaHeartbeat />
              </div>

              <span>MediCare</span>
            </div>

            <span className="register-welcome">
              GET STARTED
            </span>

            <h1>
              Create your account
            </h1>

            <p>
              Join MediCare and take control of
              your healthcare journey.
            </p>

          </div>

          {/* MESSAGE */}

          {message && (
            <div
              className={
                message.toLowerCase().includes("success")
                  ? "register-message success"
                  : "register-message error"
              }
            >
              {message.toLowerCase().includes("success") ? (
                <FaCheckCircle />
              ) : (
                <FaUserShield />
              )}

              <span>{message}</span>
            </div>
          )}

          {/* FORM */}

          <form
            className="register-form"
            onSubmit={handleRegister}
          >

            {/* NAME */}

            <div className="register-input-group">

              <label htmlFor="name">
                Full Name
              </label>

              <div className="register-input-wrapper">

                <FaUser className="register-input-icon" />

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {/* EMAIL */}

            <div className="register-input-group">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="register-input-wrapper">

                <FaEnvelope className="register-input-icon" />

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="register-input-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="register-input-wrapper">

                <FaLock className="register-input-icon" />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

            </div>

            {/* ROLE */}

            <div className="register-input-group">

              <label htmlFor="role">
                I am registering as
              </label>

              <div className="register-role-options">

                {/* PATIENT */}

                <label
                  className={`register-role-card ${
                    formData.role === "patient"
                      ? "selected"
                      : ""
                  }`}
                >

                  <input
                    type="radio"
                    name="role"
                    value="patient"
                    checked={
                      formData.role === "patient"
                    }
                    onChange={handleChange}
                  />

                  <div className="role-card-icon">
                    <FaUser />
                  </div>

                  <div className="role-card-content">
                    <strong>
                      Patient
                    </strong>

                    <span>
                      Book and manage appointments
                    </span>
                  </div>

                  <div className="role-check">
                    <FaCheckCircle />
                  </div>

                </label>

                {/* DOCTOR */}

                <label
                  className={`register-role-card ${
                    formData.role === "doctor"
                      ? "selected"
                      : ""
                  }`}
                >

                  <input
                    type="radio"
                    name="role"
                    value="doctor"
                    checked={
                      formData.role === "doctor"
                    }
                    onChange={handleChange}
                  />

                  <div className="role-card-icon doctor">
                    <FaUserMd />
                  </div>

                  <div className="role-card-content">
                    <strong>
                      Doctor
                    </strong>

                    <span>
                      Manage patients and appointments
                    </span>
                  </div>

                  <div className="role-check">
                    <FaCheckCircle />
                  </div>

                </label>

              </div>

            </div>

            {/* REGISTER BUTTON */}

            <button
              type="submit"
              className="register-submit-btn"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="register-spinner"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <FaArrowRight />
                </>
              )}

            </button>

          </form>

          {/* DIVIDER */}

          <div className="register-divider">
            <span>Already have an account?</span>
          </div>

          {/* LOGIN */}

          <div className="register-login">

            <span>
              Already registered?
            </span>

            <Link to="/login">
              Sign in
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;