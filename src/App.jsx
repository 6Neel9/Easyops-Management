import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:3001/api";

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      const response = await axios.get(`${BASE_URL}/users`);
      setUsers(response.data);
    }
    fetchUsers();
  }, []);

  async function handleAddUser(e) {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/users`, newUser);
      setUsers([...users, response.data]);
      setNewUser({ firstName: "", lastName: "", contactNumber: "" });
    } catch (error) {
      alert("Duplicate User or ContactNumber Found");
    }
  }

  async function handleDeleteUser(id) {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await axios.delete(`${BASE_URL}/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    const response = await axios.get(
      `${BASE_URL}/users/search?q=${searchTerm}`
    );
    setUsers(response.data);
  }

  async function handleSort() {
    const response = await axios.get(`${BASE_URL}/users/sort`);
    setUsers(response.data);
  }

  return (
    <div>
      <h1>Easyops Management Table</h1>
      <form onSubmit={handleAddUser}>
        <input
          type="text"
          placeholder="First name"
          value={newUser.firstName}
          onChange={(e) =>
            setNewUser({ ...newUser, firstName: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Last name"
          value={newUser.lastName}
          onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Contact number"
          value={newUser.contactNumber}
          onChange={(e) =>
            setNewUser({ ...newUser, contactNumber: e.target.value })
          }
          required
        />
        <button type="submit">Add User</button>
      </form>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <button onClick={handleSort}>Sort by Name</button>
      <table>
        <thead>
          <tr>
            <th>SN.</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Contact Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.contactNumber}</td>
              <td>
                <button onClick={() => handleDeleteUser(user._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
