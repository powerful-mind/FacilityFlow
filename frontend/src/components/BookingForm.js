import React, { useState, useEffect, useRef } from "react";
import { API } from "../api";

export default function BookingForm({ date, onClose }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const formRef = useRef(null);

  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [form, setForm] = useState({
    applicantName: user.name || "",
    department: user.department || "",
    eventName: "",
    guestNames: "",
    totalPersons: "",
    facultyStaff: "",
    contactNumber: "",
    peonAttendant: "",
    hall: "",
  });

  const fullSlots = [
    "8-9 AM",
    "9-10 AM",
    "10-11 AM",
    "11-12 PM",
    "12-1 PM",
    "1-2 PM",
    "2-3 PM",
    "3-4 PM",
    "4-5 PM",
    "5-6 PM",
  ];

  // Fetch booked slots
  useEffect(() => {
    if (!form.hall) {
      setBookedSlots([]);
      setSelectedSlots([]);
      return;
    }
    const fetchBooked = async () => {
      try {
        const res = await API.get("/bookings");
        const booked = res.data
          .filter(
            (b) =>
              b.hall === form.hall &&
              b.date === date &&
              b.status === "Hall Approved"
          )
          .flatMap((b) => b.timeSlots || []);
        setBookedSlots([...new Set(booked)]);
      } catch (err) {
        console.error("Error fetching booked slots:", err);
      }
    };
    fetchBooked();
  }, [form.hall, date]);

  // Toggle slot selection
  const toggleSlot = (slot) => {
    if (bookedSlots.includes(slot)) return;
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(form.contactNumber)) {
      alert("Please enter a valid 10-digit contact number.");
      return;
    }

    if (!form.hall) return alert("Please select a hall first.");
    if (selectedSlots.length === 0)
      return alert("Please select at least one time slot.");

    try {
      await API.post("/bookings/create", {
        ...form,
        date,
        timeSlots: selectedSlots,
        submittedBy: user.name,
      });
      alert("Booking Submitted Successfully!");
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || "Error submitting booking";
      alert(msg);
    }
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50 px-4 py-10">
      <div
        ref={formRef}
        className="bg-white rounded-2xl shadow-2xl p-6 w-[350px] sm:w-[420px] max-h-[85vh] overflow-y-auto mt-24 mb-12"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
          Facility Booking Form
        </h2>
        <p className="text-center text-sm text-gray-500 mb-4">
          Date Selected: <span className="font-semibold">{date}</span>
        </p>

        {/* Hall selection */}
        <select
          className="border p-2 mb-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500"
          value={form.hall}
          onChange={(e) => setForm({ ...form, hall: e.target.value })}
          required
        >
          <option value="">Select Hall</option>
          <option value="Auditorium">Auditorium</option>
          <option value="Seminar Hall">Seminar Hall</option>
          <option value="LRDC Hall">LRDC Hall</option>
        </select>

        {/* Time slots */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {fullSlots.map((slot) => {
            const isBooked = bookedSlots.includes(slot);
            const isSelected = selectedSlots.includes(slot);
            return (
              <button
                key={slot}
                type="button"
                onClick={() => toggleSlot(slot)}
                disabled={!form.hall || isBooked}
                className={`py-2 rounded-lg text-sm font-medium transition-all ${
                  isBooked
                    ? "bg-red-500 text-white cursor-not-allowed"
                    : isSelected
                    ? "bg-green-600 text-white"
                    : !form.hall
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>

        {/* Input Fields */}
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
            placeholder="Name of Applicant"
            value={form.applicantName}
            onChange={(e) =>
              setForm({ ...form, applicantName: e.target.value })
            }
            required
          />
          <input
            className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
            placeholder="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            required
          />
          <input
            className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
            placeholder="Event Name"
            value={form.eventName}
            onChange={(e) => setForm({ ...form, eventName: e.target.value })}
            required
          />
          <input
            className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
            placeholder="Guest Names (Optional)"
            value={form.guestNames}
            onChange={(e) => setForm({ ...form, guestNames: e.target.value })}
          />
          <input
            className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
            type="number"
            placeholder="Total Persons"
            value={form.totalPersons}
            onChange={(e) =>
              setForm({ ...form, totalPersons: e.target.value })
            }
            required
          />
          <input
            className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
            placeholder="Faculty/Staff Deputed"
            value={form.facultyStaff}
            onChange={(e) =>
              setForm({ ...form, facultyStaff: e.target.value })
            }
            required
          />

          {/* ✅ Contact Number Field (10 digits only) */}
          <input
            className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
            type="tel"
            placeholder="Contact Number (10 digits)"
            maxLength="10"
            pattern="[0-9]{10}"
            value={form.contactNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // remove non-digits
              if (value.length <= 10)
                setForm({ ...form, contactNumber: value });
            }}
            required
          />

          <input
            className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
            placeholder="Peon/Attendant (Optional)"
            value={form.peonAttendant}
            onChange={(e) =>
              setForm({ ...form, peonAttendant: e.target.value })
            }
          />

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              Back
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
