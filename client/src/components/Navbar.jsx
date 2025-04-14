import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, User, Bell, Menu, X, ChevronDown, MessageCircle, Package } from 'lucide-react';
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
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { cartCount, notificationCount, fetchCartData } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    fetchCartData();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchCartData]);

  const navbarBackground = useTransform(scrollY, [0, 50], ["rgba(17, 24, 39, 0.9)", "rgba(17, 24, 39, 0.98)"]);
  const navbarHeight = useTransform(scrollY, [0, 50], ["5rem", "3.5rem"]);
  const navbarPadding = useTransform(scrollY, [0, 50], ["1.25rem", "0.5rem"]);
  const logoScale = useTransform(scrollY, [0, 50], [1, 0.85]);
  const navbarVariants = { hidden: { opacity: 0, y: -50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
  const itemVariants = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
  const searchVariants = { initial: { width: "100%" }, focused: { width: "110%", boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)", transition: { duration: 0.3 } } };
  const buttonHoverVariants = { initial: { scale: 1 }, hover: { scale: 1.05, boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)", transition: { type: "spring", stiffness: 400, damping: 10 } }, tap: { scale: 0.95 } };
  const userMenuVariants = { hidden: { opacity: 0, scale: 0.95, y: -10 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } } };

  const handleLoginClick = () => navigate('/login');
  const handleProductsClick = () => navigate('/products');
  const handleChatsClick = () => navigate('/chats');

  return (
    <motion.div initial="hidden" animate="visible" variants={navbarVariants} className="sticky top-0 z-50 w-full">
      <motion.nav className="flex items-center p-4 bg-gray-900 shadow-lg border-b border-gray-800 backdrop-blur-sm" style={{ backgroundColor: navbarBackground, height: navbarHeight, padding: navbarPadding }} transition={{ duration: 0.3 }}>
        <div className="container mx-auto flex items-center justify-between">
          <motion.div className="flex items-center" style={{ scale: logoScale }}>
            <motion.h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-400 to-indigo-600 cursor-pointer" whileHover={{ backgroundPosition: "100% 50%" }} transition={{ duration: 0.8 }}>
              Aknuff
            </motion.h1>
          </motion.div>
          <motion.div className="hidden md:block md:w-2/5 lg:w-1/2 xl:w-1/3 mx-4" variants={itemVariants}>
            <motion.div className="relative" variants={searchVariants} animate={isSearchFocused ? "focused" : "initial"}>
              <div className="absolute inset-y-0 left-3 flex items-center"><Search className="h-4 w-4 text-gray-400" /></div>
              <input type="text" placeholder="Search for games, gift cards..." className="w-full pl-10 pr-20 py-2 rounded-full bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" onFocus={() => setIsSearchFocused(true)} onBlur={() => setIsSearchFocused(false)} />
              <motion.button variants={buttonHoverVariants} className="absolute right-0 top-0 h-full px-4 rounded-r-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors duration-300">Search</motion.button>
            </motion.div>
          </motion.div>
          <div className="flex items-center space-x-4">
            <motion.div className="flex items-center space-x-3" variants={itemVariants}>
              <motion.a href="/notifications" variants={buttonHoverVariants} className="relative text-white p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-300">
                <Bell size={18} />
                {notificationCount > 0 && <motion.div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{notificationCount}</motion.div>}
              </motion.a>
              <motion.a href="/cart" variants={buttonHoverVariants} className="relative bg-indigo-600 text-white font-bold p-2 rounded-full hover:bg-indigo-700 transition-colors duration-300 flex items-center">
                <ShoppingCart size={18} />
                {cartCount > 0 && <motion.div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{cartCount}</motion.div>}
              </motion.a>
              <motion.a href="/products" variants={buttonHoverVariants} className="relative text-white p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-300" onClick={e => { e.preventDefault(); handleProductsClick(); }}>
                <Package size={18} />
              </motion.a>
              {isLoggedIn && (
                <motion.a href="/chats" variants={buttonHoverVariants} className="text-white p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-300" onClick={e => { e.preventDefault(); handleChatsClick(); }}>
                  <MessageCircle size={18} />
                </motion.a>
              )}
              {isLoggedIn ? (
                <div className="relative">
                  <motion.div variants={buttonHoverVariants} onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center justify-center h-9 w-9 rounded-full bg-indigo-600 text-white font-bold cursor-pointer">
                    {user?.name?.charAt(0).toUpperCase() || <User size={18} />}
                  </motion.div>
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div variants={userMenuVariants} initial="hidden" animate="visible" exit="hidden" className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-2" onMouseEnter={() => setIsUserMenuOpen(true)} onMouseLeave={() => setIsUserMenuOpen(false)}>
                        <button onClick={() => navigate('/profile')} className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors">Profile</button>
                        <button onClick={() => navigate('/settings')} className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors">Settings</button>
                        <button onClick={logout} className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors">Logout</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button onClick={handleLoginClick} variants={buttonHoverVariants} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-full hover:bg-indigo-700 transition-colors duration-300 flex items-center space-x-2">
                  <User size={16} />
                  <span>Login</span>
                </motion.button>
              )}
            </motion.div>
            <motion.button className="md:hidden block text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>
      <motion.div className="md:hidden bg-gray-900 px-4 pb-3 border-b border-gray-800">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center"><Search className="h-4 w-4 text-gray-400" /></div>
          <input type="text" placeholder="Search for games, gift cards..." className="w-full pl-10 pr-20 py-2 rounded-full bg-gray-800 border border ((((border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
          <motion.button variants={buttonHoverVariants} className="absolute right-0 top-0 h-full px-4 rounded-r-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors duration-300">Search</motion.button>
        </div>
      </motion.div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div className="fixed top-14 right-0 bottom-0 w-3/4 bg-gray-900 z-50 shadow-xl border-l border-gray-800 p-5" initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }} transition={{ duration: 0.4 }}>
            <div className="flex flex-col h-full">
              <motion.div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-4">Categories</h3>
                <div className="space-y-3">
                  {['Mobile Games', 'PC Games', 'Console Games', 'Gift Cards', 'Game Points'].map(item => (
                    <motion.a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="block text-gray-300 hover:text-indigo-400 py-2 border-b border-gray-800">{item}</motion.a>
                  ))}
                </div>
              </motion.div>
              <motion.div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-4">Account</h3>
                <div className="space-y-3">
                  {['Login', 'Register', 'My Orders', 'Wishlist', 'Products', 'Settings'].map(item => (
                    <motion.a key={item} href={item === 'Products' ? '/products' : `#${item.toLowerCase().replace(' ', '-')}`} className="block text-gray-300 hover:text-indigo-400 py-2 border-b border-gray-800" onClick={item === 'Products' ? e => { e.preventDefault(); handleProductsClick(); } : undefined}>{item}</motion.a>
                  ))}
                </div>
              </motion.div>
              <motion.div className="mt-auto">
                <motion.button className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300">Contact Support</motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.nav className="bg-gray-800 text-white py-3 shadow-md sticky z-40 transition-all duration-300 backdrop-blur-sm" style={{ top: scrolled ? '3.5rem' : '5rem' }}>
        <div className="container mx-auto flex justify-center space-x-6 overflow-x-auto px-4">
          {['All Categories', 'Steam Gift Cards', 'BIGO Live', 'PSN Card', 'RBL Universe', 'Top Up MLBB', 'Game Points'].map((category, index) => (
            <motion.a key={category} className={`whitespace-nowrap transition-all duration-300 ${index === 0 ? 'font-bold text-indigo-400' : ''}`} href={`#${category.toLowerCase().replace(/ /g, '-')}`}>
              <span className="relative">{category}<motion.span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500" whileHover={{ width: "100%" }} transition={{ duration: 0.3 }} /></span>
              {index === 0 && <ChevronDown size={14} className="inline-block ml-1" />}
            </motion.a>
          ))}
        </div>
      </motion.nav>
    </motion.div>
  );
};

export default Navbar;