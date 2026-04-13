import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    if (!username) tempErrors.username = "Username is required";
    if (!password) tempErrors.password = "Password is required";
    if (!email) tempErrors.email = "Email is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/api/register/`, {
        username,
        password,
        email,
      });
      if (response.status === 201) {
        alert("Registration successful");
        navigate("/login");
      } else {
        setErrors({ form: "Registration failed" });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ form: "Registration failed" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-coral to-orange-300">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-coral mb-6">
          Register
        </h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="text-red-500 text-xs italic">{errors.username}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">{errors.email}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic">{errors.password}</p>
            )}
          </div>
          {errors.form && (
            <p className="text-red-500 text-xs italic text-center">
              {errors.form}
            </p>
          )}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-coral text-white font-bold py-2 px-4 rounded-full hover:bg-coral-dark focus:outline-none focus:shadow-outline">
              Register
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-coral hover:text-coral-dark"
              href="/login">
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
