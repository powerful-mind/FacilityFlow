import React, { useEffect, useState } from "react";
import { API } from "../api";
import BookingForm from "../components/BookingForm";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [bookings, setBookings] = useState([]);

  const timeSlots = [
    "8-9", "9-10", "10-11", "11-12", "12-1",
    "1-2", "2-3", "3-4", "4-5", "5-6"
  ];

  // 🟢 Fetch bookings
  useEffect(() => {
    API.get("/bookings").then((res) => setBookings(res.data));
  }, []);

  // 🟣 Date click logic (with real-time validation)
  const handleDateClick = (info) => {
    const today = new Date();
    const clicked = new Date(info.dateStr);

    // Prevent selecting past days (even within same month)
    if (clicked.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) {
      alert("You cannot book past dates!");
      return;
    }

    setSelectedDate(info.dateStr);

    const dateBookings = bookings.filter(
      (b) => b.date === info.dateStr && b.status === "Hall Approved"
    );
    const slots = dateBookings.flatMap((b) => b.timeSlots);
    setBookedSlots(slots);
    setShowForm(true);
  };

  // 🟦 Prepare event data
  const eventDates = bookings.map((b) => ({
    title: `${b.hall} (${b.status})`,
    date: b.date,
    color:
      b.status === "Hall Approved"
        ? "#16a34a" // green
        : b.status === "Pending"
        ? "#facc15" // yellow
        : "#f97316", // orange
  }));

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Facility Booking Calendar
        </h1>

        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-200">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
            selectable={true}
            dateClick={handleDateClick}
            events={eventDates}
            eventDisplay="block"
            dayMaxEventRows={3}
            validRange={{ start: today }} // Prevent navigating before today
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek",
            }}
            titleFormat={{ year: "numeric", month: "long" }}
            dayHeaderClassNames="bg-blue-100 text-blue-800 font-semibold"
            dayCellDidMount={(arg) => {
              // Disable clicking on past days
              const cellDate = new Date(arg.date);
              const now = new Date();
              if (cellDate.setHours(0, 0, 0, 0) < now.setHours(0, 0, 0, 0)) {
                arg.el.style.opacity = "0.4";
                arg.el.style.pointerEvents = "none";
              }
            }}
          />
        </div>

        {/* Booking Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            >
              <div className="w-full max-w-md">
                <BookingForm
                  date={selectedDate}
                  bookedSlots={bookedSlots}
                  allSlots={timeSlots}
                  onClose={() => setShowForm(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
