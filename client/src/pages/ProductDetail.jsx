// client/src/pages/ProductDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Star, Share2, Heart, MessageCircle, ShoppingCart, Shield, Clock, ArrowLeft } from "lucide-react";
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ text: "", rating: 0 });
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/product/${id}`);
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/reviews/${id}`);
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleAddReview = async () => {
    if (!user || !token) {
      alert('You must be logged in to submit a review.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
          text: newReview.text,
          rating: newReview.rating,
          userId: user.id, // Include the user ID
        }),
      });

      const responseData = await response.json();
      if (response.ok) {
        setNewReview({ text: "", rating: 0 });
        const updatedReviews = await fetch(`http://localhost:3000/api/reviews/${id}`);
        const data = await updatedReviews.json();
        setReviews(data);
      } else {
        console.error('Failed to add review:', response.status, responseData);
        if (response.status === 401) {
          alert('Your session has expired. Please log in again.');
          navigate('/login');
        } else {
          alert(responseData.error || 'Failed to add review');
        }
      }
    } catch (error) {
      console.error("Error adding review:", error);
      alert('Error adding review. Please try again.');
    }
  };

  const handleChatWithSeller = () => {
    if (!product?.user?._id || !product?._id) {
      console.error("Seller ID or Product ID is missing");
      return;
    }
    navigate(`/chat/${product.user._id}?productId=${product._id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white">
        <motion.div
          className="flex flex-col items-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-medium text-blue-400">Loading Product Details...</p>
        </motion.div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white">
        <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl border border-red-500/30 max-w-md">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
          <p className="text-gray-400 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const productImages = [
    `http://localhost:3000${product.image}`,
    `http://localhost:3000${product.image}`,
    `http://localhost:3000${product.image}`,
  ];

  const avgRating = reviews.length 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center text-sm text-gray-400">
          <button onClick={() => navigate('/')} className="hover:text-blue-400 transition-colors">Home</button>
          <span className="mx-2">/</span>
          <button onClick={() => navigate('/products')} className="hover:text-blue-400 transition-colors">Products</button>
          <span className="mx-2">/</span>
          <span className="text-blue-400 truncate max-w-xs">{product.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <div className="bg-gray-800/40 p-6 rounded-2xl shadow-lg border border-gray-700/50">
              <motion.div 
                className="w-full h-96 relative overflow-hidden rounded-xl bg-gray-900/60"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={productImages[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <motion.button
                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white border border-white/20"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setWishlist(!wishlist)}
                  >
                    <Heart className={`h-5 w-5 ${wishlist ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </motion.button>
                  <motion.button
                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white border border-white/20"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Share2 className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.div>
              
              <div className="mt-4 flex space-x-4 overflow-x-auto pb-2 pt-2">
                {productImages.map((img, index) => (
                  <motion.div
                    key={index}
                    className={`relative rounded-lg overflow-hidden cursor-pointer flex-shrink-0 ${
                      selectedImage === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-20 h-20 object-cover" />
                    {selectedImage === index && (
                      <div className="absolute inset-0 bg-blue-500/20 border border-blue-500/50"></div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-10 bg-gray-800/40 rounded-2xl shadow-lg border border-gray-700/50 overflow-hidden">
              <div className="border-b border-gray-700">
                <div className="flex">
                  <button className="px-6 py-4 text-blue-400 border-b-2 border-blue-500 font-medium">
                    Reviews ({reviews.length})
                  </button>
                  <button className="px-6 py-4 text-gray-400 hover:text-white transition-colors">
                    Product Description
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="text-4xl font-bold text-white mr-4">
                      {avgRating.toFixed(1)}
                      <span className="text-lg text-gray-400 font-normal">/5.0</span>
                    </div>
                    <div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={`h-5 w-5 ${
                              index < Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">{reviews.length} reviews</div>
                    </div>
                  </div>
                  <motion.button
                    className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30 flex items-center"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => document.getElementById('write-review').scrollIntoView({ behavior: 'smooth' })}
                  >
                    Write a Review
                    <Star className="h-4 w-4 ml-2" />
                  </motion.button>
                </div>

                {reviews.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-gray-400">No reviews yet. Be the first to review this product!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="bg-gray-900/40 p-5 rounded-xl border border-gray-700/50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold mr-3">
                              {(review.user?.name || "A")[0]}
                            </div>
                            <div>
                              <p className="font-medium text-white">{review.user?.name || "Anonymous"}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(review.createdAt).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center bg-gray-800/70 px-3 py-1 rounded-lg">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                            <span className="text-sm font-medium">{review.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <p className="text-gray-300 mt-3 leading-relaxed">{review.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div id="write-review" className="mt-10 bg-gray-900/40 p-6 rounded-xl border border-gray-700/50">
                  <h3 className="text-xl font-semibold text-white mb-4">Write a Review</h3>
                  <div className="mb-6">
                    <label className="block text-gray-400 mb-2">Your Rating</label>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setNewReview({ ...newReview, rating: index + 1 })}
                        >
                          <Star
                            className={`h-8 w-8 mr-1 ${
                              index < newReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                            }`}
                          />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-400 mb-2">Your Review</label>
                    <textarea
                      className="w-full p-4 border border-gray-700 rounded-xl bg-gray-800/70 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                      placeholder="Share your experience with this product..."
                      value={newReview.text}
                      onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                    />
                  </div>
                  <motion.button
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium"
                    whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(79,70,229,0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddReview}
                  >
                    Submit Review
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-gray-800/40 p-6 rounded-2xl shadow-lg border border-gray-700/50 sticky top-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">{product.title}</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="text-sm text-gray-300">
                      {avgRating.toFixed(1)} ({reviews.length} reviews)
                    </span>
                  </div>
                  <span className="text-gray-500">•</span>
                  <div className="text-sm text-emerald-400 flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    <span>Verified Seller</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl mb-6 border border-gray-700/40">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xl font-bold mr-3">
                    {product.user?.name ? product.user.name[0] : "S"}
                  </div>
                  <div>
                    <p className="font-medium text-white">{product.user?.name || "Store"}</p>
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Online 22 minutes ago</span>
                    </div>
                  </div>
                </div>
                <motion.button
                  className="flex items-center px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleChatWithSeller}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat
                </motion.button>
              </div>

              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  ${product.price}
                </span>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-medium text-white mb-2">Product Description</h3>
                <p className="text-gray-300 leading-relaxed">{product.description}</p>
              </div>

              {product.platform && (
                <div className="bg-gray-900/40 rounded-xl p-4 mb-8 border border-gray-700/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Platform</p>
                      <p className="text-white font-medium">{product.platform}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Genre</p>
                      <p className="text-white font-medium">{product.genre || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Game ID</p>
                      <p className="text-white font-medium">{product.gameId || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Quantity</p>
                      <p className="text-white font-medium">In Stock</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-8">
                <label className="block text-white font-medium mb-2">Quantity</label>
                <div className="flex h-12">
                  <motion.button
                    className="w-12 flex justify-center items-center bg-gray-900 text-white rounded-l-lg border border-gray-700"
                    whileHover={{ backgroundColor: "rgba(31, 41, 55, 0.9)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                  >
                    -
                  </motion.button>
                  <input
                    type="number"
                    value={quantity}
                    className="w-20 text-center bg-gray-800 text-white border-y border-gray-700 focus:outline-none"
                    readOnly
                  />
                  <motion.button
                    className="w-12 flex justify-center items-center bg-gray-900 text-white rounded-r-lg border border-gray-700"
                    whileHover={{ backgroundColor: "rgba(31, 41, 55, 0.9)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <motion.button
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium flex items-center justify-center"
                  whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(79,70,229,0.4)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart • ${(product.price * quantity).toFixed(2)}
                </motion.button>
                
                <motion.button
                  className="w-full py-4 bg-gray-700/40 text-white rounded-xl font-medium border border-gray-600/50"
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(75, 85, 99, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleChatWithSeller}
                >
                  Chat with Seller
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;