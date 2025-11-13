import React, { useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "", role: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/login", form);
      const role = res.data.user.role;
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (role === "clubhead" || role === "faculty") navigate("/club");
      else if (role === "hod") navigate("/hod");
      else if (role === "hallmanager") navigate("/hall");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <Navbar />

      <motion.div
        className="flex flex-col items-center mt-20 px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="bg-white p-8 rounded-2xl w-full sm:w-[400px] border border-gray-200"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">
            FacilityFlow Login
          </h1>

          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
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
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              required
            >
              <option value="">Select Role</option>
              <option value="faculty">Faculty</option>
              <option value="clubhead">Club Head</option>
              <option value="hod">HOD</option>
              <option value="hallmanager">Hall Manager</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
            >
              Login
            </motion.button>
          </form>

          <motion.button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-600 mt-4 w-full hover:underline text-sm"
            whileHover={{ scale: 1.03 }}
          >
            New user? Register here
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
