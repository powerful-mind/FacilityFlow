import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CalendarPage from "./pages/CalendarPage";
import DashboardClub from "./pages/DashboardClub";
import DashboardHOD from "./pages/DashboardHOD";
import DashboardHall from "./pages/DashboardHall";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/club" element={<DashboardClub />} />
        <Route path="/hod" element={<DashboardHOD />} />
        <Route path="/hall" element={<DashboardHall />} />
      </Routes>
    </Router>
  );
}
