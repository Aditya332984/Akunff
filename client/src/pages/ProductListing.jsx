import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartSummary from '../components/CartSummary';
import { FiFilter, FiStar, FiShoppingCart, FiHeart, FiTrendingUp, FiTag } from 'react-icons/fi';

// Enhanced MarketplaceBanner with animated background elements
const MarketplaceBanner = () => (
  <motion.div
    className="relative overflow-hidden bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white py-10"
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <motion.div
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 2px, transparent 2px)",
        backgroundSize: "30px 30px",
      }}
      animate={{ backgroundPosition: ["0 0", "30px 30px"] }}
      transition={{ duration: 8, repeat: Infinity }}
    />
    
    {/* Floating game icons */}
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm"
        initial={{ 
          x: Math.random() * 100 - 50 + '%', 
          y: Math.random() * 100 - 50 + '%',
          opacity: 0.3 
        }}
        animate={{ 
          y: [0, -20, 0], 
          opacity: [0.3, 0.6, 0.3],
          rotate: [0, 360]
        }}
        transition={{ 
          duration: 3 + Math.random() * 5, 
          repeat: Infinity,
          delay: i * 0.5
        }}
      />
    ))}
    
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center md:text-left"
      >
        <h2 className="text-4xl font-extrabold mb-2">Epic Game Marketplace</h2>
        <p className="text-lg opacity-90 max-w-md">Your premier destination for digital treasures and gaming adventures</p>
      </motion.div>
      <div className="flex gap-4">
        <motion.button
          className="px-6 py-3 bg-white text-[#6366f1] rounded-full font-bold shadow-lg flex items-center"
          whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,255,255,0.5)" }}
          whileTap={{ scale: 0.95 }}
        >
          <FiTrendingUp className="mr-2" />
          Trending
        </motion.button>
        <motion.button
          className="px-6 py-3 bg-[#a855f7]/20 border border-white/40 text-white rounded-full font-bold shadow-lg backdrop-blur-sm"
          whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(168,85,247,0.5)" }}
          whileTap={{ scale: 0.95 }}
        >
          Browse All
        </motion.button>
      </div>
    </div>
  </motion.div>
);

// Enhanced GameCard component with more dynamic animations and better UI
const GameCard = ({ product, onAddToCart, onAddToWishlist }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Generate random rating between 4.0 and 5.0
  const rating = (4 + Math.random()).toFixed(1);

  return (
    <motion.div
      className="bg-gray-800/90 rounded-xl overflow-hidden border border-[#6366f1]/30 shadow-lg relative"
      whileHover={{ 
        scale: 1.03, 
        boxShadow: "0 0 20px rgba(99,102,241,0.3)",
        y: -5
      }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={`http://localhost:3000${product.image}`}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
        />
        
        {/* Platform badge */}
        <div className="absolute top-2 right-2 bg-[#6366f1]/90 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
          {product.platform}
        </div>
        
        {/* Like button */}
        <motion.button
          className="absolute top-2 left-2 w-8 h-8 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full text-white"
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,0,0,0.3)" }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onAddToWishlist && onAddToWishlist(product);
          }}
        >
          <FiHeart />
        </motion.button>
        
        {/* Quick add to cart overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-4 px-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            className="w-full py-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-lg font-semibold flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart && onAddToCart(product);
            }}
          >
            <FiShoppingCart className="mr-2" /> Quick Add
          </motion.button>
        </motion.div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-white truncate flex-1">{product.title}</h3>
          <span className="flex items-center text-yellow-400 text-sm font-medium ml-2">
            <FiStar className="mr-1" /> {rating}
          </span>
        </div>
        
        <p className="text-sm text-gray-400 line-clamp-2 h-10">{product.description}</p>
        
        <div className="mt-3 flex justify-between items-center">
          <span className="text-xl font-bold text-[#a855f7]">${product.price}</span>
          <span className="text-xs py-1 px-2 bg-gray-700/70 rounded-full text-gray-300">{product.genre}</span>
        </div>
        
        <motion.button
          className="w-full mt-4 py-2.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-lg font-semibold shadow-lg shadow-purple-900/20"
          whileHover={{ scale: 1.03, boxShadow: "0 5px 15px rgba(168,85,247,0.4)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(`/product/${product._id}`)}
        >
          View Details
        </motion.button>
      </div>
    </motion.div>
  );
};

// New FilterSidebar component for the right side space
const FilterSidebar = ({ categories, platforms, onFilter }) => {
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  
  const handleCategoryToggle = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  const handlePlatformToggle = (platform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };
  
  useEffect(() => {
    onFilter && onFilter({
      priceRange,
      categories: selectedCategories,
      platforms: selectedPlatforms
    });
  }, [priceRange, selectedCategories, selectedPlatforms, onFilter]);
  
  return (
    <motion.div
      className="bg-gray-900/90 rounded-2xl p-6 border border-[#6366f1]/30 shadow-xl sticky top-24"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <FiFilter className="mr-2 text-[#a855f7]" /> 
        <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
          Filters
        </span>
      </h3>
      
      {/* Price Range */}
      <div className="mb-6">
        <h4 className="text-sm text-gray-400 mb-3">Price Range</h4>
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium">${priceRange[0]}</span>
          <span className="text-white font-medium">${priceRange[1]}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#a855f7]"
        />
      </div>
      
      {/* Categories */}
      <div className="mb-6">
        <h4 className="text-sm text-gray-400 mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center">
              <input
                type="checkbox"
                id={`category-${index}`}
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="w-4 h-4 accent-[#a855f7] bg-gray-700 border-gray-600 rounded focus:ring-[#6366f1]"
              />
              <label htmlFor={`category-${index}`} className="ml-2 text-sm font-medium text-gray-300">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Platforms */}
      <div className="mb-6">
        <h4 className="text-sm text-gray-400 mb-3">Platforms</h4>
        <div className="flex flex-wrap gap-2">
          {platforms.map((platform, index) => (
            <motion.button
              key={index}
              className={`px-3 py-1 text-xs rounded-full ${
                selectedPlatforms.includes(platform)
                  ? 'bg-[#6366f1] text-white'
                  : 'bg-gray-800 text-gray-400 border border-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePlatformToggle(platform)}
            >
              {platform}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Recommended Games - Using the right side efficiently */}
      <div className="mt-8">
        <h3 className="text-md font-bold mb-4 flex items-center">
          <FiStar className="mr-2 text-yellow-400" /> 
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Recommended Games
          </span>
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <motion.div 
              key={i}
              className="flex gap-3 p-2 rounded-lg hover:bg-gray-800/70 cursor-pointer"
              whileHover={{ x: 3 }}
            >
              <div className="w-14 h-14 rounded-md overflow-hidden flex-shrink-0">
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600"></div>
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-medium text-white">Featured Game {i}</h5>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-yellow-400 flex items-center">
                    <FiStar className="mr-1" size={10} /> 4.{8+i}
                  </span>
                  <span className="mx-2 text-gray-600">•</span>
                  <span className="text-xs text-[#a855f7] font-medium">${19+i*5}.99</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Reset Filters button */}
      <motion.button
        className="w-full mt-6 py-2 border border-[#6366f1]/50 text-[#6366f1] rounded-lg font-medium"
        whileHover={{ scale: 1.02, borderColor: "#a855f7" }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setPriceRange([0, 100]);
          setSelectedCategories([]);
          setSelectedPlatforms([]);
        }}
      >
        Reset Filters
      </motion.button>
    </motion.div>
  );
};

// New PromoSection component
const PromoSection = () => (
  <motion.div
    className="bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 rounded-2xl p-6 mb-8 border border-[#6366f1]/20"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
  >
    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
      <div>
        <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
          Special Gaming Bundles
        </h3>
        <p className="text-gray-400 text-sm max-w-lg">
          Get exclusive bundles with up to 70% off! Limited time offers on premium game collections.
        </p>
      </div>
      <motion.button
        className="px-6 py-2.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full font-bold shadow-lg flex items-center"
        whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(99,102,241,0.5)" }}
        whileTap={{ scale: 0.95 }}
      >
        <FiTag className="mr-2" />
        View Offers
      </motion.button>
    </div>
  </motion.div>
);

// Enhanced ProductListing component with right sidebar
const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Sample categories and platforms for filters
  const categories = ["Action", "Adventure", "RPG", "Strategy", "Simulation", "Sports"];
  const platforms = ["PC", "PlayStation", "Xbox", "Switch", "Mobile"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/product');
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.genre && product.genre.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
    // Here you would typically call an API to update the cart
  };

  const handleAddToWishlist = (product) => {
    setWishlist([...wishlist, product]);
    // Here you would typically call an API to update the wishlist
  };

  const handleFilter = (filters) => {
    // Implement filtering logic based on filters object
    console.log("Applying filters:", filters);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0f172a] text-white">
        <motion.div
          className="flex flex-col items-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div 
            className="w-16 h-16 border-4 border-t-[#6366f1] border-r-[#a855f7] border-b-[#6366f1] border-l-[#a855f7] rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <p className="mt-4 text-xl font-semibold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
            Loading Marketplace...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white relative overflow-hidden">
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(99,102,241,0.3), transparent 70%)",
          opacity: 0.4,
        }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      
      {/* Animated particles in background */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#6366f1]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 100 - 50],
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
      
      <Navbar />
      <MarketplaceBanner />

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="relative w-full md:w-1/2">
              <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <motion.input
                type="search"
                placeholder="Search games, genres, or game IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-6 py-3 bg-gray-800/80 rounded-full border border-[#6366f1]/50 focus:outline-none focus:ring-2 focus:ring-[#a855f7] text-white"
                whileFocus={{ scale: 1.02 }}
              />
            </div>
            <div className="flex gap-4">
              <motion.button
                onClick={() => navigate('/sell')}
                className="px-6 py-3 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full font-bold shadow-lg flex items-center"
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99,102,241,0.7)" }}
                whileTap={{ scale: 0.95 }}
              >
                <FiTag className="mr-2" />
                Sell Your Product
              </motion.button>
              <motion.button
                className="px-6 py-3 bg-gray-800/80 border border-[#6366f1]/30 rounded-full font-bold shadow-lg flex items-center"
                whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(99,102,241,0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                <FiHeart className="mr-2" />
                Wishlist ({wishlist.length})
              </motion.button>
            </div>
          </div>
        </motion.div>

        <PromoSection />

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div
            className="lg:w-3/4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gray-900/90 rounded-2xl p-8 border border-[#6366f1]/30 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent flex items-center">
                  <FiShoppingCart className="mr-2 text-[#a855f7]" />
                  {filteredProducts.length} Products Available
                </h2>
                <select className="bg-gray-800 border border-[#6366f1]/30 text-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#a855f7]">
                  <option>Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Most Popular</option>
                </select>
              </div>
              
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <GameCard 
                      key={product._id} 
                      product={product} 
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                    />
                  ))}
                </div>
              ) : (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="inline-block bg-gray-800/80 p-6 rounded-full mb-4">
                    <FiFilter className="w-12 h-12 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-300 mb-2">No Products Found</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    We couldn't find any items matching your search. Try adjusting your filters or search term!
                  </p>
                  <motion.button
                    className="mt-6 px-6 py-2 bg-[#6366f1]/20 border border-[#6366f1]/50 rounded-full text-[#6366f1] font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </motion.button>
                </motion.div>
              )}
              
              {filteredProducts.length > 0 && (
                <div className="flex justify-center mt-10">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(page => (
                      <motion.button
                        key={page}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          page === 1 
                            ? 'bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white' 
                            : 'bg-gray-800 text-gray-400'
                        }`}
                        whileHover={{ scale: 1.1, backgroundColor: page !== 1 ? "rgba(99,102,241,0.2)" : undefined }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {page}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Right Sidebar - Fixing the empty space */}
          <div className="lg:w-1/4">
            {user && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <CartSummary cart={cart} />
              </motion.div>
            )}
            
            <FilterSidebar 
              categories={categories} 
              platforms={platforms}
              onFilter={handleFilter}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductListing;