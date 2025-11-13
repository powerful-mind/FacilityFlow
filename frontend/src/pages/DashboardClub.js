import React, { useEffect, useState } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardClub() {
  const [bookings, setBookings] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  // 🟢 Fetch bookings by current user
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get("/bookings");
        const myBookings = res.data.filter((b) => b.submittedBy === user.name);
        setBookings(myBookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
    fetchBookings();
  }, [user.name]);

  // 🗑️ Clear single booking (UI only)
  const clearBooking = (id) => {
    if (window.confirm("Are you sure you want to clear this booking?")) {
      setBookings((prev) => prev.filter((b) => b._id !== id));
    }
  };

  // 🧹 Clear all approved/rejected bookings (UI only)
  const clearAllApprovedRejected = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear all approved/rejected bookings?"
    );
    if (!confirmClear) return;

    setBookings((prev) =>
      prev.filter(
        (b) =>
          b.status !== "Hall Approved" && !b.status.includes("Rejected")
      )
    );
    alert("Cleared all approved/rejected bookings from view!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-6">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-6 text-center text-gray-800"
        >
          Club / Faculty Dashboard
        </motion.h1>

        {/* Actions */}
        <div className="flex justify-center gap-3 mb-6">
          <motion.a
            href="/calendar"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            + New Booking
          </motion.a>

          {bookings.some(
            (b) =>
              b.status === "Hall Approved" || b.status.includes("Rejected")
          ) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearAllApprovedRejected}
              className="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-red-700 transition"
            >
              Clear Approved / Rejected
            </motion.button>
          )}
        </div>

        {/* Bookings List */}
        <AnimatePresence>
          {bookings.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-600 mt-8 text-lg"
            >
              No bookings yet.
            </motion.p>
          ) : (
            <div className="grid gap-5 max-w-3xl mx-auto">
              {bookings.map((b) => (
                <motion.div
                  key={b._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="border bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {b.eventName}
                  </h3>
                  <div className="text-gray-600 text-sm">
                    <p><b>Date:</b> {b.date}</p>
                    <p><b>Hall:</b> {b.hall}</p>
                    <p>
                      <b>Status:</b>{" "}
                      <span
                        className={
                          b.status.includes("Rejected")
                            ? "text-red-600"
                            : b.status === "Hall Approved"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }
                      >
                        {b.status}
                      </span>
                    </p>

                    {/* Rejection Reason */}
                    {b.status.includes("Rejected") && b.rejectionReason && (
                      <p className="mt-2 text-red-600 text-sm">
                        <b>Reason:</b> {b.rejectionReason}
                      </p>
                    )}
                  </div>

                  {/* Clear Button */}
                  {(b.status === "Hall Approved" ||
                    b.status.includes("Rejected")) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => clearBooking(b._id)}
                      className="mt-3 bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 transition"
                    >
                      Clear
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
