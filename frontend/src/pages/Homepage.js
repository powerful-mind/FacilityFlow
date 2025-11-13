import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, Building2 } from "lucide-react";

export default function Homepage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleGetStarted = () => {
    if (user) {
      if (user.role === "faculty" || user.role === "clubhead") navigate("/club");
      else if (user.role === "hod") navigate("/hod");
      else if (user.role === "hallmanager") navigate("/hall");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-blue-100 text-gray-800">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <motion.section
        className="flex flex-col items-center justify-center flex-grow text-center px-6 py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 text-blue-700">
          FacilityFlow
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl">
          Streamline your institute’s facility booking with an intelligent, role-based
          approval and scheduling system.
        </p>
        <motion.button
          onClick={handleGetStarted}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-blue-700 transition"
        >
          Get Started
        </motion.button>
      </motion.section>

      {/* How It Works */}
      <section className="bg-white py-16 border-t border-gray-200 -mt-8 shadow-sm relative z-10">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-blue-700 mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="p-10 bg-blue-50 rounded-2xl border border-blue-100 hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="flex justify-center mb-5">
                <Calendar className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-blue-700 mb-3">
                Submit Booking Request
              </h3>
              <p className="text-gray-600 text-base leading-relaxed px-2">
                Faculty and club heads easily request Auditorium, Seminar, or LRDC Hall
                reservations using a streamlined online booking form.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-10 bg-blue-50 rounded-2xl border border-blue-100 hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="flex justify-center mb-5">
                <CheckCircle className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-blue-700 mb-3">
                Review & Approve
              </h3>
              <p className="text-gray-600 text-base leading-relaxed px-2">
                Department HODs review requests and approve them digitally,
                ensuring a transparent and efficient approval workflow.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-10 bg-blue-50 rounded-2xl border border-blue-100 hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="flex justify-center mb-5">
                <Building2 className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-blue-700 mb-3">
                Manage & Monitor Facilities
              </h3>
              <p className="text-gray-600 text-base leading-relaxed px-2">
                Hall managers finalize approved bookings and oversee efficient
                facility use — preventing scheduling conflicts and overlaps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 bg-gray-900 text-gray-300 mt-auto text-sm sm:text-base">
        © {new Date().getFullYear()} FacilityFlow — Smart Facility Management
      </footer>
    </div>
  );
}
