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
  const [isBuyAccountsOpen, setIsBuyAccountsOpen] = useState(false);
  const { scrollY } = useScroll();
  const { cartCount, notificationCount, fetchCartData } = useCart();
  const navigate = useNavigate();

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu') && !event.target.closest('.user-button')) {
        setIsUserMenuOpen(false);
      }
      if (!event.target.closest('.buy-accounts-menu') && !event.target.closest('.buy-accounts-button')) {
        setIsBuyAccountsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsUserMenuOpen(false);
        setIsBuyAccountsOpen(false);
      }
    };
    
    const handleResize = () => {
      // Close mobile menu on screen resize to desktop
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    fetchCartData();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [fetchCartData]);

  // Close menu when ESC key is pressed
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
        setIsBuyAccountsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const navbarBackground = useTransform(scrollY, [0, 50], ['rgba(17, 24, 39, 0.9)', 'rgba(17, 24, 39, 0.98)']);
  const navbarHeight = useTransform(scrollY, [0, 50], ['5rem', '4rem']);
  const navbarPadding = useTransform(scrollY, [0, 50], ['1rem', '0.5rem']);
  const logoScale = useTransform(scrollY, [0, 50], [1, 0.9]);

  const handleNavigate = (path) => {
    setIsMenuOpen(false);
    setIsBuyAccountsOpen(false);
    setIsUserMenuOpen(false);
    navigate(path);
  };

  // Animation variants
  const navbarVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } }
  };

  const buttonHoverVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, boxShadow: '0 0 15px rgba(255, 85, 85, 0.3)', transition: { type: 'spring', stiffness: 400, damping: 10 } },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={navbarVariants} 
      className="sticky top-0 z-50 w-full"
    >
      <motion.nav
        className="flex items-center justify-between px-3 sm:px-4 lg:px-6 bg-gray-900 shadow-xl border-b border-gray-800 backdrop-blur-md"
        style={{ backgroundColor: navbarBackground, height: navbarHeight, padding: navbarPadding }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo & Hamburger Menu */}
        <div className="flex items-center">
          {/* Mobile menu toggle */}
          <motion.button
            className="lg:hidden text-white mr-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
          
          {/* Logo */}
          <motion.h1
            className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 cursor-pointer tracking-tight"
            onClick={() => handleNavigate('/')}
            style={{ scale: logoScale }}
            whileHover={{ scale: 1.05 }}
          >
            Akunff
          </motion.h1>
        </div>

        {/* Desktop Navigation - Hidden on smaller screens */}
        <motion.div 
          className="hidden lg:flex items-center space-x-5 xl:space-x-8" 
          variants={itemVariants}
        >
          <motion.button
            onClick={() => handleNavigate('/')}
            className="text-gray-200 hover:text-indigo-400 font-medium transition-colors duration-200"
            whileHover={{ y: -2 }}
          >
            Home
          </motion.button>

          {/* Buy Accounts Dropdown */}
          <div className="relative buy-accounts-menu">
            <motion.button
              onClick={() => setIsBuyAccountsOpen(!isBuyAccountsOpen)}
              className="text-gray-200 hover:text-indigo-400 font-medium flex items-center transition-colors duration-200 buy-accounts-button"
              whileHover={{ y: -2 }}
            >
              Buy Accounts <ChevronDown className="ml-1 w-4 h-4" />
            </motion.button>
            <AnimatePresence>
              {isBuyAccountsOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute left-0 mt-3 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-3 overflow-hidden"
                >
                  <div className="space-y-2">
                    {[
                      { label: 'Free Fire Accounts', path: '/products?game=free-fire' },
                      { label: 'PUBG / BGMI Accounts', path: '/products?game=pubg' },
                      { label: 'Valorant Accounts', path: '/products?game=valorant' },
                      { label: 'Call of Duty Accounts', path: '/products?game=cod' },
                      { label: 'GTA 5 / RP Accounts', path: '/products?game=gta' },
                      { label: 'Mobile Legends Accounts', path: '/products?game=mlbb' },
                      { label: 'Roblox Accounts', path: '/products?game=roblox' },
                      { label: 'Other Game Accounts', path: '/products?game=other' },
                    ].map((item) => (
                      <motion.button
                        key={item.label}
                        onClick={() => handleNavigate(item.path)}
                        className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                        whileHover={{ x: 5, backgroundColor: '#4B5EAA' }}
                      >
                        {item.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            onClick={() => handleNavigate('/sell')}
            className="text-gray-200 hover:text-indigo-400 font-medium transition-colors duration-200"
            whileHover={{ y: -2 }}
          >
            Sell Accounts
          </motion.button>
          
          <motion.button
            onClick={() => handleNavigate('/redeem-codes')}
            className="text-gray-200 hover:text-indigo-400 font-medium transition-colors duration-200"
            whileHover={{ y: -2 }}
          >
            Redeem Codes
          </motion.button>
          
          <motion.button
            onClick={() => handleNavigate('/top-ups')}
            className="text-gray-200 hover:text-indigo-400 font-medium transition-colors duration-200"
            whileHover={{ y: -2 }}
          >
            Top-Ups
          </motion.button>
          
          <motion.button
            onClick={() => handleNavigate('/digital-products')}
            className="text-gray-200 hover:text-indigo-400 font-medium transition-colors duration-200 whitespace-nowrap"
            whileHover={{ y: -2 }}
          >
            Digital Products
          </motion.button>
          
          <motion.button
            onClick={() => handleNavigate('/blog')}
            className="hidden xl:block text-gray-200 hover:text-indigo-400 font-medium transition-colors duration-200"
            whileHover={{ y: -2 }}
          >
            Blog
          </motion.button>
          
          <motion.button
            onClick={() => handleNavigate('/support')}
            className="hidden xl:block text-gray-200 hover:text-indigo-400 font-medium transition-colors duration-200"
            whileHover={{ y: -2 }}
          >
            Support
          </motion.button>
        </motion.div>

        {/* Right Side - Icons & Sell Now CTA */}
        <motion.div className="flex items-center" variants={itemVariants}>
          {/* Notification Icon */}
          <motion.button
            onClick={() => handleNavigate('/notifications')}
            variants={buttonHoverVariants}
            whileHover="hover"
            whileTap="tap"
            className="relative text-gray-200 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-300 mr-2"
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {notificationCount}
              </div>
            )}
          </motion.button>

          {/* Cart Icon */}
          <motion.button
            onClick={() => handleNavigate('/cart')}
            variants={buttonHoverVariants}
            whileHover="hover"
            whileTap="tap"
            className="relative bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors duration-300 mr-2"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {cartCount}
              </div>
            )}
          </motion.button>

          {/* User Menu */}
          {isLoggedIn ? (
            <div className="relative user-menu mr-2 lg:mr-3">
              <motion.div
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold cursor-pointer user-button"
              >
                {user?.name?.charAt(0).toUpperCase() || <User size={20} />}
              </motion.div>
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute right-0 mt-3 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-3 z-50"
                  >
                    <button
                      onClick={() => handleNavigate('/profile')}
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200"
                    >
                      My Account
                    </button>
                    <button
                      onClick={() => handleNavigate('/settings')}
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200"
                    >
                      Settings
                    </button>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200"
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
              className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-indigo-700 transition-colors duration-300 flex items-center space-x-2 mr-2 sm:mr-3"
            >
              <User size={16} />
              <span>Login</span>
            </motion.button>
          )}

          {/* Sell Now CTA */}
          <motion.button
            onClick={() => handleNavigate('/sell')}
            variants={buttonHoverVariants}
            whileHover="hover"
            whileTap="tap"
            className="hidden sm:block bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-2 px-4 sm:px-6 rounded-full shadow-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300"
          >
            Sell Now
          </motion.button>
        </motion.div>
      </motion.nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              className="absolute top-16 left-0 bottom-0 w-3/4 max-w-xs bg-gray-900 z-50 shadow-2xl border-r border-gray-800 p-6 overflow-y-auto"
              initial={{ opacity: 0, x: '-100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col space-y-4">
                <button onClick={() => handleNavigate('/')} className="text-white text-lg font-medium py-2 border-b border-gray-800 text-left">Home</button>
                
                <div>
                  <button
                    onClick={() => setIsBuyAccountsOpen(!isBuyAccountsOpen)}
                    className="text-white text-lg font-medium py-2 w-full text-left flex items-center justify-between border-b border-gray-800"
                  >
                    Buy Accounts <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isBuyAccountsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isBuyAccountsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pl-4 space-y-2 mt-2 overflow-hidden"
                      >
                        {[
                          { label: 'Free Fire Accounts', path: '/products?game=free-fire' },
                          { label: 'PUBG / BGMI Accounts', path: '/products?game=pubg' },
                          { label: 'Valorant Accounts', path: '/products?game=valorant' },
                          { label: 'Call of Duty Accounts', path: '/products?game=cod' },
                          { label: 'GTA 5 / RP Accounts', path: '/products?game=gta' },
                          { label: 'Mobile Legends Accounts', path: '/products?game=mlbb' },
                          { label: 'Roblox Accounts', path: '/products?game=roblox' },
                          { label: 'Other Game Accounts', path: '/products?game=other' },
                        ].map((item) => (
                          <motion.button
                            key={item.label}
                            onClick={() => handleNavigate(item.path)}
                            className="block w-full text-left text-gray-300 hover:text-white py-2 px-3 rounded-lg hover:bg-gray-800"
                            whileHover={{ x: 5 }}
                          >
                            {item.label}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <button onClick={() => handleNavigate('/sell')} className="text-white text-lg font-medium py-2 border-b border-gray-800 text-left">Sell Accounts</button>
                <button onClick={() => handleNavigate('/redeem-codes')} className="text-white text-lg font-medium py-2 border-b border-gray-800 text-left">Redeem Codes</button>
                <button onClick={() => handleNavigate('/top-ups')} className="text-white text-lg font-medium py-2 border-b border-gray-800 text-left">Top-Ups & Recharges</button>
                <button onClick={() => handleNavigate('/digital-products')} className="text-white text-lg font-medium py-2 border-b border-gray-800 text-left">Digital Products</button>
                <button onClick={() => handleNavigate('/blog')} className="text-white text-lg font-medium py-2 border-b border-gray-800 text-left">Blog / News</button>
                <button onClick={() => handleNavigate('/support')} className="text-white text-lg font-medium py-2 border-b border-gray-800 text-left">Support</button>
                
                {isLoggedIn && (
                  <>
                    <button onClick={() => handleNavigate('/profile')} className="text-white text-lg font-medium py-2 border-b border-gray-800 text-left">My Account</button>
                    <button onClick={() => handleNavigate('/settings')} className="text-white text-lg font-medium py-2 border-b border-gray-800 text-left">Settings</button>
                    <button onClick={logout} className="text-white text-lg font-medium py-2 border-b border-gray-800 text-left">Logout</button>
                  </>
                )}
                
                {!isLoggedIn && (
                  <button onClick={() => handleNavigate('/login')} className="text-white text-lg font-medium py-2 border-b border-gray-800 text-left">Login</button>
                )}
                
                <motion.button
                  onClick={() => handleNavigate('/sell')}
                  variants={buttonHoverVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 px-6 rounded-full shadow-lg mt-4 w-full"
                >
                  Sell Now
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;