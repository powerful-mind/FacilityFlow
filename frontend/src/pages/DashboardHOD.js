import React, { useEffect, useState } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardHOD() {
  const hod = JSON.parse(localStorage.getItem("user"));
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);

  // 🟢 Fetch all pending requests for this HOD’s department
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get("/bookings");
        const dept = hod.department?.toLowerCase().trim();
        const filtered = res.data.filter(
          (b) =>
            b.department?.toLowerCase().trim() === dept &&
            b.status === "Pending"
        );
        setRequests(filtered);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
    fetchBookings();
  }, [hod.department]);

  // 🟢 Approve a booking and refresh list
  const approve = async (id) => {
    try {
      await API.put(`/bookings/approve/hod/${id}`, {
        hodSignature: hod.eSignature,
      });
      alert("Approved successfully!");
      setSelected(null);
      setRequests((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Approval failed:", err);
      alert("Failed to approve booking.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <AnimatePresence>
        {/* ✅ Detail View (No animation when viewing form) */}
        {selected ? (
          <motion.div
            key="details"
            className="p-6 max-w-3xl mx-auto bg-white rounded-2xl shadow-md mt-10"
          >
            <h1 className="text-3xl font-bold mb-5 text-center text-gray-800">
              Booking Request Details
            </h1>

            <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
              <p><b>Applicant:</b> {selected.submittedBy}</p>
              <p><b>Department:</b> {selected.department}</p>
              <p><b>Event:</b> {selected.eventName}</p>
              <p><b>Date:</b> {selected.date}</p>
              <p><b>Hall:</b> {selected.hall}</p>
              <p><b>Time Slots:</b> {selected.timeSlots.join(", ")}</p>
              <p><b>Guest Names:</b> {selected.guestNames}</p>
              <p><b>Total Persons:</b> {selected.totalPersons}</p>
              <p><b>Faculty/Staff:</b> {selected.facultyStaff}</p>
              <p><b>Contact:</b> {selected.contactNumber}</p>
              <p><b>Peon/Attendant:</b> {selected.peonAttendant}</p>
              <p><b>Status:</b> {selected.status}</p>
            </div>

            <div className="flex justify-between mt-6">
              {selected.status === "Pending" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => approve(selected._id)}
                  className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Approve
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelected(null)}
                className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Back
              </motion.button>
            </div>
          </motion.div>
        ) : (
          // ✅ List View (Animated cards)
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6"
          >
            <h1 className="text-3xl font-bold mb-5 text-center text-gray-800">
              HOD Dashboard
            </h1>

            {requests.length === 0 ? (
              <p className="text-gray-600 text-center text-lg mt-6">
                No pending requests for your department.
              </p>
            ) : (
              <div className="grid gap-5 max-w-3xl mx-auto">
                {requests.map((b) => (
                  <motion.div
                    key={b._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border p-5 rounded-xl bg-white shadow-md hover:shadow-lg transition"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {b.eventName}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      <b>Applicant:</b> {b.submittedBy}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <b>Department:</b> {b.department}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <b>Date:</b> {b.date}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <b>Hall:</b> {b.hall}
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelected(b)}
                      className="mt-4 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition"
                    >
                      View Form
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
