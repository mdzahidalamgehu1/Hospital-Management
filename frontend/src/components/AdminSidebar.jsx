import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiUserPlus,
  FiLayers,
  FiCalendar,
  FiSettings,
  FiLogOut,
  FiActivity,
} from "react-icons/fi";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // We will connect this to your logout API later
    navigate("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <FiGrid />,
    },
    {
      name: "Doctors",
      path: "/admin/doctors",
      icon: <FiUserPlus />,
    },
    {
      name: "Patients",
      path: "/admin/patients",
      icon: <FiUsers />,
    },
    {
      name: "Departments",
      path: "/admin/departments",
      icon: <FiLayers />,
    },
    {
      name: "Appointments",
      path: "/admin/appointments",
      icon: <FiCalendar />,
    },
  ];

  return (
    <aside className="admin-sidebar">

      {/* Logo */}
      <div className="admin-logo">
        <div className="logo-icon">
          <FiActivity />
        </div>

        <div>
          <h2>MediCare</h2>
          <span>Hospital Management</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="admin-nav">

        <p className="nav-title">MAIN MENU</p>

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              isActive ? "admin-nav-link active" : "admin-nav-link"
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}

        <p className="nav-title settings-title">SYSTEM</p>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            isActive ? "admin-nav-link active" : "admin-nav-link"
          }
        >
          <span className="nav-icon">
            <FiSettings />
          </span>

          <span>Settings</span>
        </NavLink>

      </nav>

      {/* Bottom section */}
      <div className="sidebar-bottom">

        <div className="admin-help">
          <div className="help-icon">
            <FiActivity />
          </div>

          <div>
            <strong>Need Help?</strong>
            <span>Contact support</span>
          </div>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <FiLogOut />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
};

export default AdminSidebar;