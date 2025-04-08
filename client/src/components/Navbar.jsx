import React, { useState, useEffect } from 'react';
import {
  ShoppingCart, Search, User, Bell, Menu, X, ChevronDown,
  MessageCircle, Package
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { cartCount, notificationCount, fetchCartData } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setIsUserMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    fetchCartData();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchCartData]);

  const navbarBackground = useTransform(scrollY, [0, 50], [
    'rgba(17, 24, 39, 0.9)',
    'rgba(17, 24, 39, 0.98)'
  ]);
  const navbarHeight = useTransform(scrollY, [0, 50], ['5rem', '3.5rem']);
  const navbarPadding = useTransform(scrollY, [0, 50], ['1.25rem', '0.5rem']);
  const logoScale = useTransform(scrollY, [0, 50], [1, 0.85]);

  const handleNavigate = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const navbarVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  const searchVariants = {
    initial: { width: '100%' },
    focused: {
      width: '110%',
      boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)',
      transition: { duration: 0.3 }
    }
  };

  const buttonHoverVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)',
      transition: { type: 'spring', stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  };

  const userMenuVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.2, ease: 'easeOut' }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      className="sticky top-0 z-50 w-full"
    >
      <motion.nav
        className="flex items-center justify-between px-4 bg-gray-900 shadow-lg border-b border-gray-800 backdrop-blur-sm"
        style={{
          backgroundColor: navbarBackground,
          height: navbarHeight,
          padding: navbarPadding
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo */}
        <motion.div className="flex items-center" style={{ scale: logoScale }}>
          <motion.h1
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-400 to-indigo-600 cursor-pointer"
            onClick={() => handleNavigate('/')}
          >
            Aknuff
          </motion.h1>
        </motion.div>

        {/* Search Bar - Desktop */}
        <motion.div
          className="hidden md:block md:w-2/5 lg:w-1/2 xl:w-1/3 mx-4"
          variants={itemVariants}
        >
          <motion.div
            className="relative"
            variants={searchVariants}
            animate={isSearchFocused ? 'focused' : 'initial'}
          >
            <div className="absolute inset-y-0 left-3 flex items-center">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for games, gift cards..."
              className="w-full pl-10 pr-20 py-2 rounded-full bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <motion.button
              variants={buttonHoverVariants}
              whileHover="hover"
              whileTap="tap"
              className="absolute right-0 top-0 h-full px-4 rounded-r-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors duration-300"
            >
              Search
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Icons */}
        <motion.div
          className="flex items-center space-x-3"
          variants={itemVariants}
        >
          <motion.button
            onClick={() => handleNavigate('/notifications')}
            variants={buttonHoverVariants}
            whileHover="hover"
            whileTap="tap"
            className="relative text-white p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-300"
          >
            <Bell size={18} />
            {notificationCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {notificationCount}
              </div>
            )}
          </motion.button>

          <motion.button
            onClick={() => handleNavigate('/cart')}
            variants={buttonHoverVariants}
            whileHover="hover"
            whileTap="tap"
            className="relative bg-indigo-600 text-white font-bold p-2 rounded-full hover:bg-indigo-700 transition-colors duration-300 flex items-center"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {cartCount}
              </div>
            )}
          </motion.button>

          <motion.button
            onClick={() => handleNavigate('/products')}
            variants={buttonHoverVariants}
            whileHover="hover"
            whileTap="tap"
            className="text-white p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-300"
          >
            <Package size={18} />
          </motion.button>

          {isLoggedIn && (
            <motion.button
              onClick={() => handleNavigate('/chats')}
              variants={buttonHoverVariants}
              whileHover="hover"
              whileTap="tap"
              className="text-white p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-300"
            >
              <MessageCircle size={18} />
            </motion.button>
          )}

          {isLoggedIn ? (
            <div className="relative">
              <motion.div
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center justify-center h-9 w-9 rounded-full bg-indigo-600 text-white font-bold cursor-pointer"
              >
                {user?.name?.charAt(0).toUpperCase() || <User size={18} />}
              </motion.div>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    variants={userMenuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-2"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <button
                      onClick={() => handleNavigate('/settings')}
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors"
                    >
                      Settings
                    </button>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              onClick={() => handleNavigate('/login')}
              variants={buttonHoverVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-full hover:bg-indigo-700 transition-colors duration-300 flex items-center space-x-2"
            >
              <User size={16} />
              <span>Login</span>
            </motion.button>
          )}

          {/* Mobile Menu Toggle */}
          <motion.button
            className="md:hidden block text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </motion.div>
      </motion.nav>

      {/* Mobile Search */}
      <motion.div className="md:hidden bg-gray-900 px-4 pb-3 border-b border-gray-800">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for games, gift cards..."
            className="w-full pl-10 pr-20 py-2 rounded-full bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <motion.button
            variants={buttonHoverVariants}
            whileHover="hover"
            whileTap="tap"
            className="absolute right-0 top-0 h-full px-4 rounded-r-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors duration-300"
          >
            Search
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden fixed top-14 right-0 bottom-0 w-3/4 bg-gray-900 z-50 shadow-xl border-l border-gray-800 p-5"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => handleNavigate('/products')}
                className="text-white py-2 border-b border-gray-800"
              >
                Products
              </button>
              {isLoggedIn && (
                <>
                  <button
                    onClick={() => handleNavigate('/chats')}
                    className="text-white py-2 border-b border-gray-800"
                  >
                    Chats
                  </button>
                  <button
                    onClick={() => handleNavigate('/settings')}
                    className="text-white py-2 border-b border-gray-800"
                  >
                    Settings
                  </button>
                  <button
                    onClick={logout}
                    className="text-white py-2 border-b border-gray-800"
                  >
                    Logout
                  </button>
                </>
              )}
              {!isLoggedIn && (
                <button
                  onClick={() => handleNavigate('/login')}
                  className="text-white py-2 border-b border-gray-800"
                >
                  Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;
