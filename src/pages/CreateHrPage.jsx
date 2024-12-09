import React, { useState } from "react";
import { useRegisterMutation } from "../redux/api/Hr_api.js";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const CreateHrPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Hr-Admin", // Default value for the dropdown
    password: "",
  });
  const navigate = useNavigate();
  const [register] = useRegisterMutation();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    e.preventDefault();
    try {
      const res = await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
      });
      //console.log(res);

      if ("data" in res) {
        console.log(res.data.message);

        toast.success(res.data.message);
        setFormData({ email: "", password: "", name: "", role: "" });
        // dispatch(hrExists(res!.data!.hr))
        navigate("/all-hr");
      } else {
        const error = res.error;
        const message = error?.data?.message || "An unknown error occurred.";
        toast.error(message);
      }
    } catch (error) {
      toast.error("Signin Failed");
    }
    // You can add logic to send data to a backend server here
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 overflow-hidden"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} // Hides scrollbar
    >
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Register Hr
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500 transition"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500 transition"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Role Dropdown */}
          <div className="mb-4">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500 transition"
              required
            >
              <option value="Hr-Admin">Hr-Admin</option>
              <option value="Super-Admin">Super-Admin</option>
            </select>
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500 transition"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-400 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-purple-600 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateHrPage;
