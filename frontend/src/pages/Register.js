import React, { useState } from "react";
import { API } from "../api";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    department: "",
    hallResponsibility: "",
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(form).forEach((k) => data.append(k, form[k]));
    if (file) data.append("eSignature", file);

    try {
      await API.post("/users/register", data);
      alert("✅ Registered successfully!");
      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.message || "⚠️ Error registering user.";
      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <Navbar />

      <motion.div
        className="flex flex-col items-center mt-10 px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="bg-white p-8 rounded-2xl w-full sm:w-[420px] border border-gray-200"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
            Create an Account
          </h1>
          <p className="text-center text-gray-500 mb-6 text-sm">
            Register to manage hall bookings and approvals.
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleRegister}>
            <input
              className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Full Name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <input
              className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              type="email"
              placeholder="Email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <input
              className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              type="password"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <select
              className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              required
            >
              <option value="">Select Department</option>
              <option value="Applied Science and Humanities">
                Applied Science and Humanities
              </option>
              <option value="Computer Engineering">Computer Engineering</option>
              <option value="Information Technology">
                Information Technology
              </option>
              <option value="Civil">Civil</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Artificial Intelligence and Machine Learning">
                Artificial Intelligence and Machine Learning
              </option>
            </select>

            <select
              className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              required
            >
              <option value="">Select Role</option>
              <option value="faculty">Faculty</option>
              <option value="clubhead">Club Head</option>
              <option value="hod">HOD</option>
              <option value="hallmanager">Hall Manager</option>
            </select>

            {form.role === "hod" && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                required
                className="text-sm text-gray-600"
              />
            )}

            {form.role === "hallmanager" && (
              <select
                className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                value={form.hallResponsibility}
                onChange={(e) =>
                  setForm({ ...form, hallResponsibility: e.target.value })
                }
                required
              >
                <option value="">Select Hall Responsibility</option>
                <option value="Auditorium">Auditorium</option>
                <option value="Seminar Hall">Seminar Hall</option>
                <option value="LRDC Hall">LRDC Hall</option>
              </select>
            )}

            <motion.button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Register
            </motion.button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
