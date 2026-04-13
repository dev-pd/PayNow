import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Navbar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLogoClick = () => {
    if (user) {
      navigate("/dashboard"); // Redirect to dashboard if logged in
    } else {
      navigate("/"); // Redirect to landing page if not logged in
    }
  };

  return (
    <nav className="bg-coral p-6">
      <div className="container mx-auto flex justify-between items-center">
        <div
          className="text-white font text-4xl cursor-pointer"
          onClick={handleLogoClick}>
          Kleeviyo Pay
        </div>
        <div>
          {user ? (
            <>
              <span className="text-white mx-2">Welcome, {user.username}!</span>
              <button
                onClick={handleLogout}
                className="bg-white text-coral px-4 py-2 rounded-full mx-2">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="bg-white text-coral px-4 py-2 rounded-full mx-4">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="bg-white text-coral px-4 py-2 rounded-full mx-4">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
