import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <h2>Hospital Management System</h2>

      <div>
        {user && <span>Welcome, {user.name}</span>}

        <button onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;