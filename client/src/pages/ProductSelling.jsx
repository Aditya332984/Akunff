import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProductSelling = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    platform: "",
    genre: "",
    gameId: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);

  // Clear error after 10 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      console.log("Selected file:", file.name, file.type, `${(file.size / 1024 / 1024).toFixed(2)}MB`);
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError(`Invalid file type: ${file.type}. Please upload JPG, PNG, or WEBP.`);
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError(`File size too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum 5MB allowed.`);
        return;
      }

      setPreviewImage(URL.createObjectURL(file));
      setFormData({ ...formData, image: file });
      setError(null);
    }
  };

  const validateForm = () => {
    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setError("Please enter a valid positive price");
      return false;
    }
    
    if (!formData.image) {
      setError("Please select a product image");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!user) {
      setError("You must be logged in to list a product.");
      navigate("/login");
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token missing. Please log in again.");
      logout();
      setIsSubmitting(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        setError("Your session has expired. Please log in again.");
        logout();
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      console.error("Token decoding error:", err);
      setError("Invalid token. Please log in again.");
      logout();
      setIsSubmitting(false);
      return;
    }

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    // Prepare form data ensuring all fields are properly formatted
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("price", parseFloat(formData.price));
    form.append("platform", formData.platform);
    form.append("genre", formData.genre);
    if (formData.gameId) {
      form.append("gameId", formData.gameId);
    }
    
    // Add image as a file
    if (formData.image instanceof File) {
      form.append("image", formData.image);
      
      // Add publicId field
      const publicIdBase = `akunff/products/${formData.title.toLowerCase().replace(/\s+/g, '-')}`;
      const timestamp = Date.now().toString();
      const publicId = `${publicIdBase}-${timestamp}`;
      
      // Add publicId as a separate field
      form.append("publicId", publicId);
    } else {
      setError("Invalid image format. Please select a valid image file.");
      setIsSubmitting(false);
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      console.log("Submitting product to:", `${API_URL}/product`);
      
      const response = await fetch(`${API_URL}/product`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: form,
      });

      let responseData;
      
      try {
        responseData = await response.json();
      } catch (parseError) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error(`Server error: ${text.substring(0, 100)}`);
      }

      if (response.ok) {
        console.log("Product listed successfully:", responseData);
        
        // Reset form
        setFormData({
          title: "",
          description: "",
          price: "",
          platform: "",
          genre: "",
          gameId: "",
          image: null,
        });
        setPreviewImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        
        alert("Product listed successfully!");
        navigate("/products");
      } else {
        console.error("Server error:", responseData);
        
        if (responseData && responseData.message) {
          setError(responseData.message);
        } else {
          setError("Failed to list product. Please try again.");
        }
        
        if (response.status === 401 || response.status === 403) {
          logout();
        }
      }
    } catch (error) {
      console.error("Request error:", error);
      setError(`Error submitting product: ${error.message}`);
    } finally {
      setIsSubmitting(false);
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
              {previewImage && (
                <div className="mb-4 relative group">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border-2 border-purple-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null);
                      setFormData({ ...formData, image: null });
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1.5 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                required
                ref={fileInputRef}
                className="w-full bg-gray-800/50 py-3 px-4 rounded-xl border border-[#6366f1]/30 file:text-white file:bg-purple-500/50 file:border-0 file:rounded-lg file:px-4 file:py-2 hover:file:bg-purple-500/70 transition-colors"
              />
              <p className="text-sm text-gray-400 mt-2">
                Supported formats: JPG, PNG, WEBP (Max 5MB)
              </p>
            </div>
            <motion.button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl font-bold relative overflow-hidden"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.05, boxShadow: isSubmitting ? "none" : "0 0 20px rgba(99,102,241,0.7)" }}
              whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
            >
              {isSubmitting && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              )}
              <span className="relative z-10">
                {isSubmitting ? "Uploading..." : "List Game"}
              </span>
            </motion.button>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductSelling;