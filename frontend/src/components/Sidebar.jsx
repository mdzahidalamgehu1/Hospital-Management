import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2>Hospital Admin</h2>

      <nav>
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/departments">Departments</Link>
        <Link to="/admin/doctors">Doctors</Link>
        <Link to="/admin/patients">Patients</Link>
        <Link to="/admin/appointments">Appointments</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;