import React, { createContext, useState, useEffect } from "react";

// Create the context
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in by checking local storage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUser({ username: storedUsername });
    }
  }, []);

  const login = (username, token) => {
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
    setUser({ username });
  };

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
