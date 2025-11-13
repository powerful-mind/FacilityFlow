import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const goToDashboard = () => {
    if (!user) navigate("/login");
    else if (user.role === "faculty" || user.role === "clubhead") navigate("/club");
    else if (user.role === "hod") navigate("/hod");
    else if (user.role === "hallmanager") navigate("/hall");
  };

  return (
    <nav
      className="backdrop-blur-md bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900
      text-white px-6 py-4 shadow-lg flex justify-between items-center sticky top-0 z-50"
    >
      {/* Logo */}
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-extrabold tracking-wide cursor-pointer select-none 
        bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent 
        hover:from-blue-500 hover:to-blue-700 transition duration-300"
      >
        FacilityFlow
      </h1>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate("/")}
          className="text-gray-200 hover:text-blue-400 font-medium tracking-wide transition duration-300"
        >
          Home
        </button>

        <button
          onClick={() => navigate("/calendar")}
          className="text-gray-200 hover:text-blue-400 font-medium tracking-wide transition duration-300"
        >
          Calendar
        </button>

        <button
          onClick={goToDashboard}
          className="text-gray-200 hover:text-blue-400 font-medium tracking-wide transition duration-300"
        >
          Dashboard
        </button>

        {!user ? (
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
            text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:shadow-blue-500/30 
            transition duration-300"
          >
            Login
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800
            text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:shadow-red-500/30 
            transition duration-300"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
