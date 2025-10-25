import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get existing users or empty array
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if email already exists
    const userExists = users.some((user) => user.email === formData.email);

    if (userExists) {
      alert("User already exists. Please login instead.");
      navigate("/login");
    } else {
      // Add new user correctly
      users.push({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Signup successful!");
      navigate("/login");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Sign Up</h2>

        <input
          type="text"
          name="name" // ✅ Correct name attribute
          placeholder="Name"
          className="border p-2 w-full mb-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email" // ✅ Correct name attribute
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password" // ✅ Correct name attribute
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600"
        >
          Sign Up
        </button>

        <p className="text-sm mt-3 text-center">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
