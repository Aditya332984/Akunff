import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import Cards from '../components/Cards';

// New Featured Deals data (inspired by Itemku.com)
const featuredDeals = [
  {
    id: 1,
    title: 'The Hunt',
    tag: 'Special Event',
    buttonText: 'Buy Robux',
    buttonColor: 'bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6]',
    image: 'https://imgop.itemku.com/?url=https%3A%2F%2Fd1x91p7vw3vuq8.cloudfront.net%2Fplaceholder%2F2025313%2Fal0mwe8dxtbqah7cy3f3d.png&w=1033&q=75',
  },
  {
    id: 2,
    title: 'Growtopia',
    tag: 'Bestseller',
    buttonText: 'Unlock Items',
    buttonColor: 'bg-gradient-to-r from-[#16a34a] to-[#22c55e]',
    image: 'https://imgop.itemku.com/?url=https%3A%2F%2Fd1x91p7vw3vuq8.cloudfront.net%2Fplaceholder%2F2025311%2Fdxdj6ttiwswfsperxwp18.png&w=1033&q=75', 
  },
  {
    id: 3,
    title: 'Fisch',
    tag: 'Time to Re-Fish',
    buttonText: 'Get Started',
    buttonColor: 'bg-gradient-to-r from-[#7c3aed] to-[#a855f7]',
    image: 'https://imgop.itemku.com/?url=https%3A%2F%2Fd1x91p7vw3vuq8.cloudfront.net%2Fplaceholder%2F2025226%2F8wet60iakev8d4zthj3dl8.png&w=1033&q=75', 
  },
  {
    id: 4,
    title: 'Spring Sale',
    tag: 'Explore Deals',
    buttonText: 'Shop Now',
    buttonColor: 'bg-gradient-to-r from-[#db2777] to-[#ec4899]',
    image: 'https://imgop.itemku.com/?url=https%3A%2F%2Fd1x91p7vw3vuq8.cloudfront.net%2Fplaceholder%2F2025312%2Fmrzstjd8d17hoslhqmcwm.png&w=1033&q=75', 
  },
];

// New Free Fire Deals data
const freeFireDeals = [
  {
    id: 1,
    title: 'Elite Pass Season 15',
    description: 'Unlock exclusive rewards and missions',
    price: '$9.99',
    discount: '15% Off',
    image: 'https://i.pinimg.com/736x/5e/9d/85/5e9d852c2e85e43d2a59545eb77da902.jpg', 
    buttonText: 'Buy Now',
    buttonColor: 'bg-gradient-to-r from-[#ff4d4d] to-[#ff8c1a]',
  },
  {
    id: 2,
    title: '5000 Diamonds',
    description: 'Boost your in-game purchases',
    price: '$29.99',
    discount: '10% Off',
    image: 'https://wallpaperaccess.com/full/10807853.jpg', 
    buttonText: 'Get Diamonds',
    buttonColor: 'bg-gradient-to-r from-[#ffcc00] to-[#ff6b6b]',
  },
  {
    id: 3,
    title: 'Ultimate Bundle',
    description: 'Get skins, emotes, and more',
    price: '$19.99',
    discount: '20% Off',
    image: 'https://i.ytimg.com/vi/rVkGtcX4Bjc/maxresdefault.jpg', 
    buttonText: 'Claim Bundle',
    buttonColor: 'bg-gradient-to-r from-[#4da8da] to-[#1e90ff]',
  },
  {
    id: 4,
    title: 'Premium Skins Pack',
    description: 'Stand out with epic skins',
    price: '$14.99',
    discount: '25% Off',
    image: 'https://i.ytimg.com/vi/IiwS1aRwKnY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCEzngntkKHi881Grqapui_llbEqg', 
    buttonText: 'Unlock Skins',
    buttonColor: 'bg-gradient-to-r from-[#da70d6] to-[#ff69b4]',
  },
  {
    id: 5,
    title: 'Booster Pack',
    description: 'Double XP and rewards for 7 days',
    price: '$7.99',
    discount: '10% Off',
    image: 'https://images.hindustantimes.com/tech/img/2022/02/12/1600x900/2fcc5c02713a4849fc70377839279331jpg_1629424017477_1644667977491.jpg', 
    buttonText: 'Activate Boost',
    buttonColor: 'bg-gradient-to-r from-[#32cd32] to-[#9acd32]',
  },
];

// Stats data
const stats = [
  { id: 1, label: 'Active Users', value: '2.5M+', icon: 'users' },
  { id: 2, label: 'Transactions', value: '10M+', icon: 'credit-card' },
  { id: 3, label: 'Games', value: '500+', icon: 'gamepad' },
  { id: 4, label: 'Satisfaction', value: '99%', icon: 'star' }
];

// How it works steps
const steps = [
  { id: 1, title: 'Choose a Game', description: 'Browse our wide selection of games and digital products', icon: 'game-controller' },
  { id: 2, title: 'Select Package', description: 'Pick the top-up amount or item you need', icon: 'package' },
  { id: 3, title: 'Make Payment', description: 'Choose from multiple payment methods', icon: 'credit-card' },
  { id: 4, title: 'Get Your Items', description: 'Receive your purchase instantly in your game', icon: 'gift' }
];

// Popular categories (excluding Game Credits)
const categories = [
  { id: 2, name: 'Game Items', icon: 'sword' },
  { id: 3, name: 'Gift Cards', icon: 'gift-card' },
  { id: 4, name: 'Subscriptions', icon: 'calendar' },
  { id: 5, name: 'Game Accounts', icon: 'user' },
  { id: 6, name: 'Game Boosting', icon: 'trending-up' }
];

// Animation for sections that come into view
const SectionAnimation = ({ children, delay = 0 }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

const Home = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-white relative overflow-hidden">
      {/* Enhanced Background Effects for Gaming Vibe */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.3), transparent 70%)",
          opacity: 0.4,
        }}
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(45deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))",
          opacity: 0.3,
        }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
      />
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, #6366f1 2px, transparent 2px)",
            backgroundSize: "40px 40px",
          }}
          animate={{ opacity: [0.1, 0.3, 0.1], rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "loop" }}
        />
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`hex-home-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              opacity: 0.1 + Math.random() * 0.2,
              background: i % 2 === 0 ? '#6366f1' : '#a855f7',
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)",
            }}
            animate={{
              opacity: [0.1 + Math.random() * 0.2, 0.3 + Math.random() * 0.2, 0.1 + Math.random() * 0.2],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <Navbar onSearchClick={() => setIsSearchOpen(true)} />

      {/* Search Overlay */}
      {isSearchOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full max-w-4xl px-4">
            <div className="relative">
              <input
                type="text"
                className="w-full bg-gray-900/80 text-white py-4 px-6 rounded-lg text-lg border border-[#6366f1]/30 focus:outline-none focus:ring-2 focus:ring-[#a855f7] shadow-lg"
                placeholder="Search for games, top-ups, gift cards..."
                autoFocus
              />
              <button
                className="absolute right-4 top-4 text-gray-400 hover:text-white"
                onClick={() => setIsSearchOpen(false)}
              >
                <span className="text-xl">×</span>
              </button>
            </div>
            <div className="mt-4 bg-gray-900/80 rounded-lg p-4 border border-[#6366f1]/20 shadow-lg">
              <p className="text-gray-400 mb-2">Popular Searches:</p>
              <div className="flex flex-wrap gap-2">
                {freeFireDeals.map((deal) => (
                  <motion.span
                    key={deal.id}
                    className="bg-gray-800 px-3 py-1 rounded-full text-sm hover:bg-indigo-600 cursor-pointer"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(99, 102, 241, 0.3)" }}
                  >
                    {deal.title}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <main className="flex-grow">
        {/* Banner Section */}
        <div className="relative pb-4">
          <Banner />
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#0f172a] to-transparent"></div>
        </div>

        {/* Featured Deals Section (Inspired by Itemku.com) */}
        <SectionAnimation>
          <section className="py-8 bg-gradient-to-b from-[#0f172a] to-[#050417] relative">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-6">
                <motion.h2
                  className="text-3xl font-extrabold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ textShadow: "0 0 15px rgba(99, 102, 241, 0.5)" }}
                >
                  Featured Deals
                </motion.h2>
                <motion.button
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                  whileHover={{ x: 5, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All →
                </motion.button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredDeals.map((deal, index) => (
                  <motion.div
                    key={deal.id}
                    className="relative rounded-xl overflow-hidden border border-[#6366f1]/30 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.1 * index, duration: 0.5 },
                    }}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)",
                      borderColor: "rgba(168, 85, 247, 0.5)",
                    }}
                  >
                    {/* Background Image */}
                    <div
                      className="w-full h-48 bg-center bg-cover"
                      style={{
                        backgroundImage: `url(${deal.image})`,
                        filter: "brightness(0.8)",
                      }}
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-semibold text-white bg-yellow-500/80 px-2 py-1 rounded-full">
                          {deal.tag}
                        </span>
                        <h3 className="mt-2 text-lg font-bold text-white">{deal.title}</h3>
                      </div>
                      <motion.button
                        className={`w-full py-2 text-white font-semibold rounded-lg ${deal.buttonColor}`}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {deal.buttonText}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SectionAnimation>

        {/* Quick Categories Section */}
        <SectionAnimation>
          <section className="container mx-auto px-4 -mt-8 relative z-10 mb-12">
            <div className="bg-gray-900/80 rounded-xl shadow-lg p-6 border border-[#6366f1]/20">
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    className="flex flex-col items-center cursor-pointer"
                    whileHover={{ y: -5, scale: 1.05 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.05 * index, duration: 0.4 },
                    }}
                  >
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-br from-[#6366f1] to-[#a855f7] rounded-full flex items-center justify-center mb-2 shadow-lg"
                      whileHover={{ boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)" }}
                    >
                      <span className="text-xl text-white">{category.icon.charAt(0)}</span>
                    </motion.div>
                    <span className="text-sm text-center text-gray-300 hover:text-[#a855f7]">
                      {category.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SectionAnimation>

        {/* Free Fire Deals Section */}
        <SectionAnimation>
          <section className="py-8 bg-gradient-to-b from-[#0f172a] to-[#050417] relative">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-6">
                <motion.h2
                  className="text-3xl font-extrabold bg-gradient-to-r from-[#ff4d4d] to-[#ff8c1a] bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ textShadow: "0 0 15px rgba(255, 77, 77, 0.5)" }}
                >
                  Free Fire Deals 🔥
                </motion.h2>
                <motion.button
                  className="text-orange-400 hover:text-orange-300 text-sm font-medium"
                  whileHover={{ x: 5, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All →
                </motion.button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {freeFireDeals.map((deal, index) => (
                  <motion.div
                    key={deal.id}
                    className="relative rounded-xl overflow-hidden border border-[#ff4d4d]/30 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.1 * index, duration: 0.5 },
                    }}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 0 20px rgba(255, 77, 77, 0.5)",
                      borderColor: "rgba(255, 140, 26, 0.5)",
                    }}
                  >
                    {/* Background Image */}
                    <div
                      className="w-full h-48 bg-center bg-cover"
                      style={{
                        backgroundImage: `url(${deal.image})`,
                        filter: "brightness(0.8)",
                      }}
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-semibold text-white bg-red-500/80 px-2 py-1 rounded-full">
                          {deal.discount}
                        </span>
                        <h3 className="mt-2 text-lg font-bold text-white">{deal.title}</h3>
                        <p className="text-sm text-gray-300">{deal.description}</p>
                      </div>
                      <div>
                        <p className="text-md font-semibold text-white mb-2">{deal.price}</p>
                        <motion.button
                          className={`w-full py-2 text-white font-semibold rounded-lg ${deal.buttonColor}`}
                          whileHover={{
                            scale: 1.05,
                            boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {deal.buttonText}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SectionAnimation>

        {/* Main Product Cards Section */}
        <SectionAnimation>
          <section className="container mx-auto px-4 py-12">
            <Cards />
          </section>
        </SectionAnimation>

        {/* How It Works Section */}
        <SectionAnimation>
          <section className="py-16 bg-[#050417] relative">
            <div className="container mx-auto px-4">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2
                  className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent"
                  style={{ textShadow: "0 0 15px rgba(99, 102, 241, 0.5)" }}
                >
                  How It Works
                </h2>
                <motion.div
                  className="w-24 h-1 bg-gradient-to-r from-[#6366f1] to-[#a855f7] mx-auto rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "6rem" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                />
                <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                  Get your game credits, items, and top-ups in just a few simple steps
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className="bg-gray-900/80 p-6 rounded-xl text-center relative border border-[#6366f1]/20"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.2 * index, duration: 0.6 },
                    }}
                    whileHover={{
                      y: -10,
                      boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)",
                      borderColor: "rgba(99, 102, 241, 0.5)",
                      transition: { duration: 0.3 },
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(99, 102, 241, 0.2)",
                          "0 0 30px rgba(168, 85, 247, 0.3)",
                          "0 0 20px rgba(99, 102, 241, 0.2)",
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                    />
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] flex items-center justify-center font-bold text-xl shadow-lg">
                        {step.id}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mt-4 mb-2 text-white">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SectionAnimation>

        {/* User Testimonials Section */}
        <SectionAnimation>
          <section className="py-16 bg-[#0f172a] relative">
            <div className="container mx-auto px-4">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2
                  className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent"
                  style={{ textShadow: "0 0 15px rgba(99, 102, 241, 0.5)" }}
                >
                  What Our Users Say
                </h2>
                <motion.div
                  className="w-24 h-1 bg-gradient-to-r from-[#6366f1] to-[#a855f7] mx-auto rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "6rem" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((item, index) => (
                  <motion.div
                    key={item}
                    className="bg-gray-900/80 p-6 rounded-xl relative border border-[#6366f1]/20"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.2 * index, duration: 0.6 },
                    }}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.3)",
                      borderColor: "rgba(99, 102, 241, 0.5)",
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(99, 102, 241, 0.2)",
                          "0 0 30px rgba(168, 85, 247, 0.3)",
                          "0 0 20px rgba(99, 102, 241, 0.2)",
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                    />
                    <div className="text-indigo-400 text-4xl mb-4">"</div>
                    <p className="mb-4 text-gray-300">
                      The process was super fast! I got my game credits within seconds after payment. Will definitely use again.
                    </p>
                    <div className="flex items-center mt-6">
                      <motion.div
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] mr-3"
                        whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)" }}
                      />
                      <div>
                        <p className="font-bold text-white">User {item}</p>
                        <div className="flex text-yellow-400 text-sm">
                          <motion.span whileHover={{ scale: 1.2, color: "#facc15" }}>★</motion.span>
                          <motion.span whileHover={{ scale: 1.2, color: "#facc15" }}>★</motion.span>
                          <motion.span whileHover={{ scale: 1.2, color: "#facc15" }}>★</motion.span>
                          <motion.span whileHover={{ scale: 1.2, color: "#facc15" }}>★</motion.span>
                          <motion.span whileHover={{ scale: 1.2, color: "#facc15" }}>★</motion.span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SectionAnimation>

        {/* Stats Section */}
        <SectionAnimation>
          <section className="py-16 bg-gradient-to-r from-[#050417] to-[#0f172a] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-30"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.id}
                    className="text-center relative"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: { delay: 0.1 * index, duration: 0.5 },
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(99, 102, 241, 0.2)",
                          "0 0 30px rgba(168, 85, 247, 0.3)",
                          "0 0 20px rgba(99, 102, 241, 0.2)",
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                    />
                    <motion.h3
                      className="text-4xl lg:text-5xl font-bold text-white mb-2"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + 0.1 * index, duration: 0.6 }}
                      style={{ textShadow: "0 0 10px rgba(99, 102, 241, 0.5)" }}
                    >
                      {stat.value}
                    </motion.h3>
                    <p className="text-indigo-200">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </SectionAnimation>

        {/* CTA Section */}
        <SectionAnimation>
          <section className="py-16 relative">
            <div className="container mx-auto px-4">
              <div className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl p-8 md:p-12 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2), transparent 70%)",
                    opacity: 0.3,
                  }}
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                />
                <div className="max-w-3xl mx-auto text-center relative z-10">
                  <motion.h2
                    className="text-3xl md:text-4xl font-extrabold mb-4 text-white"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ textShadow: "0 0 15px rgba(255, 255, 255, 0.5)" }}
                  >
                    Ready to start your gaming journey?
                  </motion.h2>
                  <motion.p
                    className="text-lg text-indigo-100 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Join thousands of gamers who trust Aknuff for their gaming needs
                  </motion.p>
                  <motion.button
                    className="bg-white text-indigo-800 font-bold text-lg py-3 px-8 rounded-full shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.7)",
                      background: "linear-gradient(to right, #ffffff, #e0e7ff)",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Started Now
                  </motion.button>
                </div>
              </div>
            </div>
          </section>
        </SectionAnimation>
      </main>
      <Footer />
    </div>
  );
};

export default Home;