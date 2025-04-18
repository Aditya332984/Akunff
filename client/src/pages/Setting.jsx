import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Settings = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  // Removed unused loadingPasswordUpdate state

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    // Removed setLoadingPasswordUpdate
  
    const { password, confirmPassword } = formData;
  
    if (password !== confirmPassword) {
      setNotification({
        show: true,
        message: "Passwords do not match!",
        type: "error",
      });
      // Removed setLoadingPasswordUpdate
      return;
    }
  
    try {
      await axios.put('http://localhost:3000/api/users/update-password',
        { password },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
  
      setNotification({
        show: true,
        message: "Password updated successfully",
        type: "success",
      });
      setFormData({ password: "", confirmPassword: "" });
    } catch (error) {
      setNotification({
        show: true,
        message: error.response?.data?.message || "Failed to update password",
        type: "error",
      });
    } finally {
      setLoadingPasswordUpdate(false);
      setTimeout(() => setNotification({ show: false }), 3000);
    }
  };
  
  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to permanently delete your account?")) {
      try {
        await axios.delete('http://localhost:3000/api/users/delete', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        setNotification({
          show: true,
          message: "Account deleted successfully. Redirecting...",
          type: "success",
        });

        setTimeout(() => {
          logout();
          navigate('/login');
        }, 3000);
      } catch (error) {
        setNotification({
          show: true,
          message: error.response?.data?.message || "Failed to delete account",
          type: "error",
        });
      }
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#0f172a] text-white px-4 py-12 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.3), transparent 70%)",
            opacity: 0.4,
          }}
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
        />

        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
              Account Settings
            </h1>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="bg-gray-900/80 rounded-xl p-6 border border-[#6366f1]/20 shadow-lg">
                <div className="flex flex-col items-center">
                  <motion.div
                    className="w-24 h-24 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-3xl font-bold">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-1">{user?.name}</h3>
                  <p className="text-gray-400 text-sm">@{user?.username}</p>
                </div>

                <div className="mt-6 border-t border-gray-800 pt-4">
                  <h4 className="text-sm uppercase text-gray-400 mb-3">Account Info</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-white">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Member Since</p>
                      <p className="text-white">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-gray-900/80 rounded-xl p-6 border border-[#6366f1]/20 shadow-lg">
                <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                  Security Settings
                </h2>

                {notification.show && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-3 mb-4 rounded-lg ${
                      notification.type === "success"
                        ? "bg-green-900/50 border border-green-500/30"
                        : "bg-red-900/50 border border-red-500/30"
                    }`}
                  >
                    {notification.message}
                  </motion.div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full p-2.5 bg-gray-800/50 border border-[#6366f1]/30 rounded-lg text-white focus:ring-2 focus:ring-[#6366f1]"
                      required
                      minLength="6"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full p-2.5 bg-gray-800/50 border border-[#6366f1]/30 rounded-lg text-white focus:ring-2 focus:ring-[#6366f1]"
                      required
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white rounded-lg font-semibold mt-4"
                  >
                    Update Password
                  </motion.button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-800">
                  <h3 className="text-lg font-semibold text-red-400 mb-4">
                    Danger Zone
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-red-900/50 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-800/50"
                  >
                    Delete Account Permanently
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
