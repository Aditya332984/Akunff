import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { gameCards } from '../components/Cards'; // Import gameCards array
import axios from 'axios';
import Navbar from '../components/Navbar'; // Import Navbar
import Footer from '../components/Footer'; // Import Footer

const mockCartItems = [
  {
    _id: '1',
    name: 'Mobile Legends',
    price: 1.99,
    image: gameCards.find(game => game.title === 'Mobile Legends').image
  },
  {
    _id: '2',
    name: 'Steam Wallet',
    price: 5.00,
    image: gameCards.find(game => game.title === 'Steam Wallet').image
  },
  {
    _id: '3',
    name: 'PUBG Mobile',
    price: 2.99,
    image: gameCards.find(game => game.title === 'PUBG Mobile').image
  }
];

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const { fetchCartData } = useCart();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  useEffect(() => {
    setCartItems(mockCartItems);

    // Uncomment for real API call
    /*
    const getCartItems = async () => {
      try {
        const response = await axios.get(`${API_URL}/cart`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    getCartItems();
    */
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const handleRemoveItem = (id) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      setCartItems(cartItems.filter(item => item._id !== id));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    },
    exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 20 }
    },
    exit: { y: -30, opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
    hover: {
      y: -10,
      scale: 1.05,
      boxShadow: "0 15px 20px -10px rgba(99, 102, 241, 0.5)",
      transition: { duration: 0.3, type: "spring", stiffness: 300 }
    }
  };

  return (
    <>
      <Navbar /> {/* Add Navbar */}
      <div className="container mx-auto p-4">
        <motion.h1
          className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
          🛒 Your Cart
        </motion.h1>
        {cartItems.length === 0 ? (
          <motion.p
            className="text-center text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Your cart is empty. Start adding some games!
          </motion.p>
        ) : (
          <div>
            <AnimatePresence>
              <motion.ul
                className="space-y-4"
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {cartItems.map(item => (
                  <motion.li
                    key={item._id}
                    className="flex items-center bg-gray-900/80 shadow-lg rounded-lg p-4 border border-[#6366f1]/20"
                    variants={itemVariants}
                    whileHover="hover"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div className="ml-4 flex-1">
                      <h2 className="text-lg font-semibold text-white">{item.name}</h2>
                      <p className="text-indigo-400">${item.price.toFixed(2)}</p>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700 font-medium"
                      onClick={() => handleRemoveItem(item._id)}
                    >
                      Remove
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
            <motion.div
              className="mt-6 text-right"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-bold text-white">Total: ${calculateTotal()}</h3>
              <motion.button
                className="mt-4 px-6 py-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white rounded-md shadow-lg hover:shadow-xl"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Proceed to Checkout
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>
      <Footer /> {/* Add Footer */}
    </>
  );
};

export default Cart;
