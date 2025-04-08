// client/src/pages/ProductSelling.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProductSelling = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    platform: '',
    genre: '',
    gameId: '',
    image: null,
  });
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate user authentication
    if (!user) {
      setError('You must be logged in to list a product.');
      navigate('/login');
      return;
    }

    // Check if the token is expired
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token missing. Please log in again.');
      logout();
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        setError('Your session has expired. Please log in again.');
        logout();
        return;
      }
    } catch (err) {
      console.error('Token decoding error:', err);
      setError('Invalid token. Please log in again.');
      logout();
      return;
    }

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'price') {
        form.append(key, parseFloat(formData[key]));
      } else {
        form.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch('http://localhost:3000/api/product', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const responseData = await response.json();
      if (response.ok) {
        console.log('Product listed successfully:', responseData);
        setFormData({
          title: '',
          description: '',
          price: '',
          platform: '',
          genre: '',
          gameId: '',
          image: null,
        });
        fileInputRef.current.value = null;
        alert('Product listed successfully!');
        navigate('/products');
      } else {
        console.error('Failed to list product:', response.status, responseData);
        if (response.status === 401 || response.status === 403) {
          setError('Your session has expired or you are not authorized. Please log in again.');
          logout();
          return;
        }
        setError(responseData.message || 'Failed to list product');
      }
    } catch (error) {
      console.error('Error submitting product:', error);
      setError('Error submitting product. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-white">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-12 px-4">
        <motion.div
          className="bg-gray-900/90 p-10 rounded-2xl shadow-xl border border-[#6366f1]/40 w-full max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent text-center">
            List Your Game
          </h1>
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300">Game Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-gray-800/50 py-3 px-4 rounded-xl border border-[#6366f1]/30 focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full bg-gray-800/50 py-3 px-4 rounded-xl border border-[#6366f1]/30 focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300">Price (USD)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full bg-gray-800/50 py-3 px-4 rounded-xl border border-[#6366f1]/30 focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300">Platform</label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
                className="w-full bg-gray-800/50 py-3 px-4 rounded-xl border border-[#6366f1]/30 focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
              >
                <option value="">Select Platform</option>
                <option value="PC">PC</option>
                <option value="PlayStation">PlayStation</option>
                <option value="Xbox">Xbox</option>
                <option value="Nintendo">Nintendo</option>
                <option value="Mobile">Mobile</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300">Genre</label>
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
                className="w-full bg-gray-800/50 py-3 px-4 rounded-xl border border-[#6366f1]/30 focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300">Game ID (Optional)</label>
              <input
                type="text"
                name="gameId"
                value={formData.gameId}
                onChange={handleChange}
                className="w-full bg-gray-800/50 py-3 px-4 rounded-xl border border-[#6366f1]/30 focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
                placeholder="e.g., MLBB123456"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300">Game Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                ref={fileInputRef}
                className="w-full bg-gray-800/50 py-3 px-4 rounded-xl border border-[#6366f1]/30"
              />
            </div>
            <motion.button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl font-bold"
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99,102,241,0.7)" }}
              whileTap={{ scale: 0.95 }}
            >
              List Game
            </motion.button>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductSelling;