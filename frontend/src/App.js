import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Expenses from "./components/Expenses";
import PaymentPage from "./components/PaymentPage";
//import PaymentStatusModal from "./components/PaymentStatusModal";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<LandingPage />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="/expenses"
          element={<Expenses />}
        />
        <Route
          path="/payment"
          element={<PaymentPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
