import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { API_BASE_URL } from "../config";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const validate = () => {
    let tempErrors = {};
    if (!username) tempErrors.username = "Username is required";
    if (!password) tempErrors.password = "Password is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/api/login/`, {
        username,
        password,
      });
      if (response.status === 200) {
        login(username, "dummy_token");
        navigate("/expenses");
      } else {
        setErrors({ form: "Login failed" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ form: "Login failed" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-coral to-orange-300">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-coral mb-6">
          Login
        </h2>
        <form onSubmit={handleLogin}>
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
              Login
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-coral hover:text-coral-dark"
              href="/register">
              Register
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
