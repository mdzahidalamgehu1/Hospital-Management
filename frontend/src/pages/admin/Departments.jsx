import { useEffect, useState } from "react";
import api from "../../services/api";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments");

      setDepartments(response.data.departments || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to fetch departments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAddDepartment = async (e) => {
    e.preventDefault();

    try {
      await api.post("/departments", {
        name,
        description,
      });

      setName("");
      setDescription("");
      setMessage("Department created successfully");

      fetchDepartments();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to create department"
      );
    }
  };

  const handleDeleteDepartment = async (id) => {
    try {
      await api.delete(`/departments/${id}`);

      setMessage("Department deleted successfully");

      fetchDepartments();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to delete department"
      );
    }
  };

  return (
    <div>
      <h1>Department Management</h1>

      <form onSubmit={handleAddDepartment}>
        <input
          type="text"
          placeholder="Department name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">
          Add Department
        </button>
      </form>

      {message && <p>{message}</p>}

      {loading ? (
        <p>Loading departments...</p>
      ) : (
        <div>
          {departments.map((department) => (
            <div key={department._id}>
              <h3>{department.name}</h3>
              <p>{department.description}</p>

              <button
                onClick={() =>
                  handleDeleteDepartment(department._id)
                }
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Departments;