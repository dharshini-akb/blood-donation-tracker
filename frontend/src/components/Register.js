import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    bloodGroup: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(form);
    if (res.success) {
      navigate("/welcome");
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-red-50">
      <div className="bg-white p-8 rounded shadow-md w-96 border border-red-300">
        <h2 className="text-2xl font-bold text-center mb-4 text-red-600">Register</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          >
            <option value="">Select Role</option>
            <option value="Patient">Patient</option>
            <option value="Donor">Donor</option>
          </select>

          
          {form.role === "Donor" && (
            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="B+">B+</option>
              <option value="O+">O+</option>
              <option value="AB+">AB+</option>
              <option value="A-">A-</option>
              <option value="B-">B-</option>
              <option value="O-">O-</option>
              <option value="AB-">AB-</option>
            </select>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
