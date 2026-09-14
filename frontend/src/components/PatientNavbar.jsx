import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaHospital, FaCalendarAlt, FaUser, FaHome, FaSignOutAlt } from "react-icons/fa";
import "./PatientNavbar.css";

const PatientNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="patient-navbar">
      <div className="patient-navbar-container">

        {/* Logo */}
        <Link to="/patient" className="patient-navbar-logo">
          <FaHospital className="patient-logo-icon" />
          <span>MediCare</span>
        </Link>

        {/* Navigation Links */}
        <div className="patient-navbar-links">

          <Link
            to="/patient"
            className={`patient-nav-link ${
              isActive("/patient") ? "active" : ""
            }`}
          >
            <FaHome />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/patient/appointments"
            className={`patient-nav-link ${
              isActive("/patient/appointments") ? "active" : ""
            }`}
          >
            <FaCalendarAlt />
            <span>My Appointments</span>
          </Link>

          <Link
            to="/patient/book-appointment"
            className={`patient-nav-link ${
              isActive("/patient/book-appointment") ? "active" : ""
            }`}
          >
            <FaCalendarAlt />
            <span>Book Appointment</span>
          </Link>

          <Link
            to="/patient/profile"
            className={`patient-nav-link ${
              isActive("/patient/profile") ? "active" : ""
            }`}
          >
            <FaUser />
            <span>My Profile</span>
          </Link>

        </div>

        {/* Logout */}
        <button
          className="patient-logout-btn"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>

      </div>
    </nav>
  );
};

export default PatientNavbar;