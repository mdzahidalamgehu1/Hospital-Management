import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUserMd,
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaSignOutAlt,
} from "react-icons/fa";

import "./DoctorNavbar.css";

const DoctorNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="doctor-navbar">
      <div className="doctor-navbar-container">

        {/* Logo */}
        <Link to="/doctor" className="doctor-navbar-logo">
          <FaUserMd />
          <span>MediCare</span>
        </Link>

        {/* Navigation Links */}
        <div className="doctor-navbar-links">

          {/* Dashboard */}
          <Link
            to="/doctor"
            className={`doctor-nav-link ${
              isActive("/doctor") ? "active" : ""
            }`}
          >
            <FaHome />
            <span>Dashboard</span>
          </Link>

          {/* Patients */}
          <Link
            to="/doctor/patients"
            className={`doctor-nav-link ${
              isActive("/doctor/patients") ? "active" : ""
            }`}
          >
            <FaUsers />
            <span>My Patients</span>
          </Link>

          {/* Appointments */}
          <Link
            to="/doctor/appointments"
            className={`doctor-nav-link ${
              isActive("/doctor/appointments") ? "active" : ""
            }`}
          >
            <FaCalendarAlt />
            <span>Appointments</span>
          </Link>

          {/* Profile */}
          <Link
            to="/doctor/profile"
            className={`doctor-nav-link ${
              isActive("/doctor/profile") ? "active" : ""
            }`}
          >
            <FaUserMd />
            <span>My Profile</span>
          </Link>

        </div>

        {/* Logout */}
        <button
          className="doctor-logout-btn"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>

      </div>
    </nav>
  );
};

export default DoctorNavbar;