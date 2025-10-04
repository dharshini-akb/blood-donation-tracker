import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "donor", // default role
    bloodGroup: "", // required if role=donor
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await register(formData);
    if (res.success) {
      setSuccess("Registration successful! 🎉");
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 pt-20">
      {/* Card */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-3 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-red-200"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-red-200"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-red-200"
            required
          />

          {/* Role Selection */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-red-200"
            required
          >
            <option value="donor">Donor</option>
            <option value="patient">Patient</option>
          </select>

          {/* Blood Group (only if donor) */}
          {formData.role === "donor" && (
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-red-200"
              required
            >
              <option value="">Select Blood Group</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          )}

          <button
            type="submit"
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
