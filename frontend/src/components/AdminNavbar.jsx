import {
  FiSearch,
  FiBell,
  FiChevronDown,
} from "react-icons/fi";

const AdminNavbar = () => {
  return (
    <header className="admin-navbar">

      {/* Search */}
      <div className="navbar-search">
        <FiSearch />

        <input
          type="text"
          placeholder="Search patients, doctors..."
        />
      </div>

      {/* Right section */}
      <div className="navbar-right">

        {/* Notification */}
        <button className="notification-btn">
          <FiBell />
          <span className="notification-dot"></span>
        </button>

        {/* Admin profile */}
        <div className="admin-profile">

          <div className="profile-avatar">
            A
          </div>

          <div className="profile-info">
            <strong>Administrator</strong>
            <span>Admin</span>
          </div>

          <FiChevronDown className="profile-arrow" />

        </div>

      </div>

    </header>
  );
};

export default AdminNavbar;