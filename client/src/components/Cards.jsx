import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 }
  },
  exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } }
};

const cardVariants = {
  hidden: { y: 50, opacity: 0, scale: 0.9, rotateX: 15 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: i * 0.1
    }
  }),
  exit: { y: -30, opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  hover: {
    y: -15,
    scale: 1.05,
    boxShadow: "0 25px 30px -10px rgba(99, 102, 241, 0.5)",
    borderColor: "rgba(99, 102, 241, 0.7)",
    transition: { duration: 0.3, type: "spring", stiffness: 300 }
  }
};

const titleVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24, delay: 0.1 }
  }
};

const underlineVariants = {
  hidden: { width: 0, opacity: 0 },
  visible: { 
    width: "6rem", 
    opacity: 1,
    transition: { type: "spring", stiffness: 500, damping: 30, delay: 0.4 }
  }
};

const filterButtonVariants = {
  inactive: { 
    scale: 1, 
    backgroundColor: "rgb(31, 41, 55)",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)"
  },
  active: { 
    scale: 1.05, 
    backgroundColor: "rgb(99, 102, 241)",
    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.5)",
    transition: { type: "spring", stiffness: 500, damping: 15 }
  },
  hover: { 
    scale: 1.03, 
    boxShadow: "0 4px 8px rgba(99, 102, 241, 0.3)",
    transition: { duration: 0.2 } 
  },
  tap: { scale: 0.95 }
};

const buttonVariants = {
  rest: { scale: 1, background: "linear-gradient(to right, rgb(99, 102, 241), rgb(168, 85, 247))" },
  hover: { 
    scale: 1.05,
    background: "linear-gradient(to right, rgb(79, 70, 229), rgb(147, 51, 234))",
    boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.5)",
    y: -2,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  tap: { scale: 0.98, boxShadow: "0 5px 10px -3px rgba(99, 102, 241, 0.3)", y: 0 }
};

const badgeVariants = {
  initial: { scale: 0, opacity: 0, rotate: -45 },
  animate: { 
    scale: 1, 
    opacity: 1, 
    rotate: 0,
    transition: { type: "spring", stiffness: 500, damping: 15, delay: 0.2 }
  },
  hover: { 
    scale: 1.1, 
    boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
    transition: { duration: 0.2 }
  }
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, delay: 0.3 } }
};

const Cards = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [filteredCards, setFilteredCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        const response = await fetch(`${API_URL}/product`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('API returned non-JSON response');
        }

        const data = await response.json();
        // Simulate adding trending and discount properties if not present
        const enhancedData = data.map(item => ({
          ...item,
          trending: item.trending || Math.random() > 0.7, // 30% chance to be trending
          discount: item.discount || (Math.random() > 0.6 ? `${Math.floor(Math.random() * 20) + 5}% OFF` : null) // 40% chance to have discount
        }));
        // Limit to 15 products initially
        const limitedProducts = enhancedData.slice(0, 15);
        setFilteredCards(limitedProducts);
      } catch (err) {
        console.error('Fetch error:', err);
        setError("Couldn't load products from server");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (filter === 'All') {
      setFilteredCards(filteredCards.slice(0, 15)); // Maintain limit of 15
    } else if (filter === 'Trending') {
      setFilteredCards(filteredCards.filter(card => card.trending).slice(0, 15));
    } else if (filter === 'Discounted') {
      setFilteredCards(filteredCards.filter(card => card.discount).slice(0, 15));
    } else {
      setFilteredCards(filteredCards.filter(card => card.platform === filter || card.category === filter).slice(0, 15));
    }
  };

  if (isLoading) {
    return (
      <div className="text-center text-gray-400 mt-10">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 mt-10">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="pb-16 relative">
      {/* Background Glow Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.2), transparent 70%)",
          opacity: 0.3,
        }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Category Title */}
      <div className="mb-10 relative">
        <motion.h2 
          className="text-4xl font-extrabold text-center bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          style={{ textShadow: "0 0 15px rgba(99, 102, 241, 0.5)" }}
        >
          Popular Categories
        </motion.h2>
        <div className="flex justify-center">
          <motion.div 
            className="h-1 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full"
            variants={underlineVariants}
            initial="hidden"
            animate="visible"
          ></motion.div>
        </div>
      </div>

      {/* Filter Buttons */}
      <motion.div 
        className="flex flex-wrap justify-center gap-3 mb-12"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
      >
        {['All', 'Trending', 'Discounted', 'Mobile Games', 'PC Games', 'Console'].map((filter) => (
          <motion.button
            key={filter}
            onClick={() => handleFilterChange(filter)}
            className={`px-4 py-2 rounded-full font-medium text-white border border-[#6366f1]/30 shadow-lg`}
            variants={filterButtonVariants}
            initial="inactive"
            animate={activeFilter === filter ? "active" : "inactive"}
            whileHover="hover"
            whileTap="tap"
            style={{
              textShadow: activeFilter === filter ? "0 0 10px rgba(99, 102, 241, 0.5)" : "none"
            }}
          >
            {filter}
          </motion.button>
        ))}
      </motion.div>

      {/* Cards Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {filteredCards.map((card, index) => (
            <motion.div
              custom={index}
              key={card._id}
              className="bg-gray-900/80 rounded-xl overflow-hidden shadow-lg border border-[#6366f1]/20 relative"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover="hover"
            >
              <Link to={`/product/${card._id}`}>
                {/* Glowing Border Effect */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(99, 102, 241, 0.2)",
                      "0 0 30px rgba(168, 85, 247, 0.3)",
                      "0 0 20px rgba(99, 102, 241, 0.2)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                />

                {/* Card Image */}
                <motion.div 
                  className="relative overflow-hidden h-48"
                  whileHover={{ scale: 1.1, transition: { duration: 0.5 } }}
                >
                  <motion.img 
                    src={card.image?.url || card.image || '/api/placeholder/400/300'}
                    alt={card.title} 
                    className="w-full h-48 object-cover"
                    whileHover={{ scale: 1.1, transition: { duration: 1.5 } }}
                  />
                  
                  {/* Badges */}
                  {(card.discount || card.tag) && (
                    <motion.div 
                      className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-red-700 text-white text-xs font-bold px-3 py-1 rounded-full"
                      variants={badgeVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      style={{ boxShadow: "0 0 10px rgba(239, 68, 68, 0.5)" }}
                    >
                      {card.discount || card.tag}
                    </motion.div>
                  )}
                  {card.trending && !card.discount && !card.tag && (
                    <motion.div 
                      className="absolute top-2 right-2 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-xs font-bold px-3 py-1 rounded-full"
                      variants={badgeVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      style={{ boxShadow: "0 0 10px rgba(99, 102, 241, 0.5)" }}
                    >
                      TRENDING
                    </motion.div>
                  )}
                </motion.div>
                
                {/* Card Content */}
                <div className="p-5">
                  <motion.div 
                    className="text-xs text-gray-400 mb-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {card.platform || card.category || 'N/A'}
                  </motion.div>
                  
                  <motion.h3 
                    className="font-bold text-lg mb-2 text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {card.title}
                  </motion.h3>
                  
                  <motion.div 
                    className="text-indigo-400 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    ${card.price}
                  </motion.div>
                  
                  <motion.button
                    className="w-full text-white font-bold py-2 px-4 rounded-lg mt-5 bg-gray-800/50 border border-[#6366f1]/50 hover:bg-gray-800 hover:text-indigo-200"
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => navigate(`/product/${card._id}`)}
                  >
                    View Details
                  </motion.button>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* No Results Message */}
      {filteredCards.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-gray-400 mt-10"
        >
          <p className="text-xl">No games found in this category</p>
          <p className="mt-2">Try selecting a different category</p>
        </motion.div>
      )}
    </div>
  );
};

export default Cards;