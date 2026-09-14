import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const user = await login(email, password);

      setMessage("Login successful");

      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "doctor") {
        navigate("/doctor");
      } else if (user.role === "patient") {
        navigate("/patient");
      }
    } catch (error) {
      console.log("LOGIN ERROR:", error);
      console.log("RESPONSE:", error.response?.data);

      setMessage(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-header">
          <h1>Welcome back</h1>
          <p>Sign in to your MediCare account</p>
        </div>

        {message && (
          <div
            className={
              message === "Login successful"
                ? "login-success"
                : "login-error"
            }
          >
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">

          <div className="login-input-group">
            <label htmlFor="email">Email Address</label>

            <div className="login-input-wrapper">
              <FaEnvelope className="login-input-icon" />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="login-input-group">
            <label htmlFor="password">Password</label>

            <div className="login-input-wrapper">
              <FaLock className="login-input-icon" />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              className="forgot-password"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                <span>Sign In</span>
                <FaArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="login-divider"></div>

        <div className="login-register">
          <span>Don't have an account?</span>

          <Link to="/register">
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;