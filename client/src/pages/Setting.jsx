import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const Settings = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    username: "johndoe",
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setNotification({
        show: true,
        message: "Password changed successfully!",
        type: "success",
      });
      setPassword("");
      setConfirmPassword("");
      setCurrentPassword("");

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } else {
      setNotification({
        show: true,
        message: "Passwords do not match!",
        type: "error",
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#0f172a] text-white relative overflow-hidden px-4 py-12">
        {/* Background Effects */}

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
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(45deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))",
            opacity: 0.3,
          }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        />

        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h2
              className="text-4xl font-extrabold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent"
              style={{ textShadow: "0 0 15px rgba(99, 102, 241, 0.5)" }}
            >
              Account Settings
            </h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-[#6366f1] to-[#a855f7] mx-auto rounded-full mt-2"
              initial={{ width: 0 }}
              animate={{ width: "6rem" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Profile Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="md:col-span-1"
            >
              <div className="bg-gray-900/80 rounded-xl p-6 border border-[#6366f1]/20 shadow-lg mb-6">
                <div className="flex flex-col items-center">
                  <motion.div
                    className="w-24 h-24 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] flex items-center justify-center mb-4"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)",
                    }}
                  >
                    <span className="text-3xl font-bold">
                      {profile.name.charAt(0)}
                    </span>
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {profile.name}
                  </h3>
                  <p className="text-gray-400 text-sm">@{profile.username}</p>

                  <motion.button
                    className="mt-4 px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg border border-[#6366f1]/30"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 10px rgba(99, 102, 241, 0.3)",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Change Avatar
                  </motion.button>
                </div>

                <div className="mt-6 border-t border-gray-800 pt-4">
                  <h4 className="text-sm uppercase text-gray-400 mb-3">
                    Account Info
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-400">
                        Full Name
                      </label>
                      <p className="text-white">{profile.name}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400">
                        Email Address
                      </label>
                      <p className="text-white">{profile.email}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400">
                        Username
                      </label>
                      <p className="text-white">@{profile.username}</p>
                    </div>
                  </div>

                  <motion.button
                    className="mt-4 w-full py-2 text-sm text-center bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-lg text-white font-medium"
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Edit Profile
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Password & Settings Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="md:col-span-2"
            >
              <div className="bg-gray-900/80 rounded-xl p-6 border border-[#6366f1]/20 shadow-lg">
                <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                  Security Settings
                </h3>

                {notification.show && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 mb-6 rounded-lg ${
                      notification.type === "success"
                        ? "bg-green-900/50 border border-green-500/30 text-green-400"
                        : "bg-red-900/50 border border-red-500/30 text-red-400"
                    }`}
                  >
                    {notification.message}
                  </motion.div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div>
                    <label className="block font-medium text-gray-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full p-3 bg-gray-800/50 border border-[#6366f1]/30 rounded-lg text-white focus:outline-none focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] transition-all"
                      required
                      placeholder="Enter your current password"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 bg-gray-800/50 border border-[#6366f1]/30 rounded-lg text-white focus:outline-none focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] transition-all"
                      required
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3 bg-gray-800/50 border border-[#6366f1]/30 rounded-lg text-white focus:outline-none focus:border-[#a855f7] focus:ring-1 focus:ring-[#a855f7] transition-all"
                      required
                      placeholder="Confirm new password"
                    />
                  </div>

                  <div className="pt-2">
                    <motion.button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white rounded-lg font-semibold shadow-lg"
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Update Password
                    </motion.button>
                  </div>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-800">
                  <h4 className="text-lg font-semibold mb-4 text-gray-200">
                    Notification Preferences
                  </h4>

                  <div className="space-y-3">
                    {[
                      "Email notifications",
                      "Push notifications",
                      "SMS alerts",
                      "Marketing emails",
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-300">{item}</span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only"
                            id={`toggle-${index}`}
                            defaultChecked={index < 2}
                          />
                          <label
                            htmlFor={`toggle-${index}`}
                            className="block w-12 h-6 bg-gray-700 rounded-full cursor-pointer transition-all duration-300 peer-checked:bg-gradient-to-r from-[#6366f1] to-[#a855f7] relative"
                          >
                            <span
                              className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                                index < 2 ? "translate-x-6" : ""
                              }`}
                            ></span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8"
          >
            <div className="bg-gray-900/80 rounded-xl p-6 border border-red-500/20 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-red-400">
                Danger Zone
              </h3>
              <p className="text-gray-400 mb-4">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
              <motion.button
                className="px-4 py-2 bg-red-900/50 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-800/50"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 0 15px rgba(239, 68, 68, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                Delete Account
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
