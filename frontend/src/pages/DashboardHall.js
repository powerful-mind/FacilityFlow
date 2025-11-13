import React, { useEffect, useState } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardHall() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    API.get("/bookings").then((res) => {
      const filtered = res.data.filter(
        (b) => b.hallManager === user.name && b.status === "HOD Approved"
      );
      setRequests(filtered);
    });
  }, [user.name]);

  const approve = async (id) => {
    await API.put(`/bookings/approve/hall/${id}`);
    alert("Hall Manager Approved");
    window.location.reload();
  };

  const reject = async (id) => {
    if (!rejectReason.trim()) {
      alert("Please provide a rejection reason!");
      return;
    }
    await API.put(`/bookings/reject/hall/${id}`, { reason: rejectReason });
    alert("Booking Rejected");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ✅ Request Detail View */}
      <AnimatePresence>
        {selectedRequest ? (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 max-w-3xl mx-auto bg-white rounded-2xl shadow-md mt-10"
          >
            <h1 className="text-3xl font-bold mb-5 text-center text-gray-800">
              Booking Details
            </h1>

            <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
              <p><b>Applicant Name:</b> {selectedRequest.submittedBy}</p>
              <p><b>Department:</b> {selectedRequest.department}</p>
              <p><b>Event:</b> {selectedRequest.eventName}</p>
              <p><b>Date:</b> {selectedRequest.date}</p>
              <p><b>Hall:</b> {selectedRequest.hall}</p>
              <p><b>Time Slots:</b> {selectedRequest.timeSlots.join(", ")}</p>
              <p><b>Guest Names:</b> {selectedRequest.guestNames}</p>
              <p><b>Total Persons:</b> {selectedRequest.totalPersons}</p>
              <p><b>Faculty/Staff Deputed:</b> {selectedRequest.facultyStaff}</p>
              <p><b>Contact Number:</b> {selectedRequest.contactNumber}</p>
              <p><b>Peon/Attendant:</b> {selectedRequest.peonAttendant}</p>
              <p><b>Status:</b> {selectedRequest.status}</p>
            </div>

            {/* ✅ Signature Display */}
            {selectedRequest.hodSignature && (
              <div className="mt-6 flex flex-col items-start">
                <p className="font-semibold mb-2 text-gray-800">
                  HOD Signature:
                </p>
                <img
                  src={`http://localhost:5000/${selectedRequest.hodSignature}`}
                  alt="HOD Signature"
                  className="w-32 h-auto border rounded-md"
                />
              </div>
            )}

            {/* ✅ Rejection Textarea */}
            <div className="mt-5">
              <textarea
                placeholder="Enter reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-400"
              />
            </div>

            {/* ✅ Action Buttons */}
            <div className="flex justify-between mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => approve(selectedRequest._id)}
                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Approve
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => reject(selectedRequest._id)}
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Reject
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedRequest(null)}
                className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Back
              </motion.button>
            </div>
          </motion.div>
        ) : (
          // ✅ List View
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6"
          >
            <h1 className="text-3xl font-bold mb-5 text-center text-gray-800">
              {user.hallResponsibility} Manager Dashboard
            </h1>

            {requests.length === 0 ? (
              <p className="text-gray-600 text-center text-lg mt-6">
                No pending requests for your hall.
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
                      onClick={() => setSelectedRequest(b)}
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
