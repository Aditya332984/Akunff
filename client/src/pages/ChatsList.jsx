// client/src/pages/ChatsList.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ChatsList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    if (!token || !user.id) {
      navigate('/login');
      return;
    }

    const fetchChats = async () => {
      try {
        console.log('Fetching chats with token:', token); // Log the token
        const response = await axios.get(`${API_URL}/messages/active`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Chats response:', response.data); // Log the response
        setChats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chats:', error);
        if (error.response?.status === 401) {
          // If unauthorized, clear localStorage and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
        setError('Failed to load chats. Please try again later.');
        setLoading(false);
      }
    };

    fetchChats();
  }, [token, user.id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0f172a] text-white">
        <motion.div
          className="text-xl font-semibold text-indigo-400"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          Loading Chats...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0f172a] text-white">
        <p className="text-lg font-semibold text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white relative overflow-hidden">
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at center, rgba(99,102,241,0.3), transparent 70%)", opacity: 0.4 }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          className="bg-gray-900/90 rounded-2xl p-8 border border-[#6366f1]/30 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
            Your Chats
          </h1>
          {chats.length > 0 ? (
            <div className="space-y-4">
              {chats.map((chat) => (
                <motion.div
                  key={chat.productId}
                  className="bg-gray-800/80 rounded-xl p-4 border border-[#6366f1]/30"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">{chat.sellerName}</h3>
                      <p className="text-sm text-gray-400">Product: {chat.productTitle}</p>
                    </div>
                    <motion.button
                      className="px-4 py-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-lg font-semibold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/chat/${chat.sellerId}?productId=${chat.productId}`)}
                    >
                      Open Chat
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.p className="text-center text-gray-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              No active chats. Start a conversation with a seller!
            </motion.p>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ChatsList;