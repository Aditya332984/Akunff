import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock game data with placeholder images (replace with actual game images)
const games = [
  {
    id: 1,
    title: "Cyberpunk 2077",
    price: "$49.99",
    discount: "25% OFF",
    image: "https://wallpapercat.com/w/full/5/d/f/2614-3840x2160-desktop-4k-cyberpunk-2077-wallpaper-photo.jpg",
    label: "Popular",
    buttonText: "Buy Now",
    description: "Night City awaits with limitless possibilities",
    category: "RPG",
  },
  {
    id: 2,
    title: "Red Dead Redemption 2",
    price: "$39.99",
    discount: "33% OFF",
    image: "https://images8.alphacoders.com/958/958091.jpg",
    label: "Best Seller",
    buttonText: "Purchase",
    description: "Become an outlaw in the untamed American wilderness",
    category: "Action Adventure",
  },
  {
    id: 3,
    title: "The Last of Us Part II",
    price: "$44.99",
    discount: "10% OFF",
    image: "https://pixelz.cc/wp-content/uploads/2024/02/the-last-of-us-part-2-remastered-ellie-uhd-4k-wallpaper.jpg",
    label: "Featured",
    buttonText: "Get Now",
    description: "A brutal journey of revenge in a post-apocalyptic world",
    category: "Action Adventure",
  },
];

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [direction, setDirection] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Autoplay functionality
  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % games.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoplay]);

  // Track mouse movement for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Handle manual slide change and pause autoplay
  const handleManualChange = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
    setIsAutoplay(false);
    setTimeout(() => setIsAutoplay(true), 10000); // Resume after 10s
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, staggerChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
      },
    }),
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % games.length);
    setIsAutoplay(false);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + games.length) % games.length);
    setIsAutoplay(false);
  };

  return (
    <div className="relative min-h-[600px] bg-[#0f172a] overflow-hidden">
      {/* Enhanced Gaming Background */}
      {/* Dynamic Cyberpunk/Sci-Fi Base */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background: "radial-gradient(circle at center, #1a103c 0%, #0e0b29 40%, #050417 100%)",
          zIndex: 1,
        }}
      />

      {/* Game Controller Outlines */}
      <svg 
        className="absolute opacity-10" 
        style={{ 
          top: '10%', 
          right: '5%', 
          width: '300px', 
          height: '300px',
          zIndex: 1,
          transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`
        }}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path 
          d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
          stroke="#a78bfa" 
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
        />
        <motion.path 
          d="M16 12h-2m-4 0H8m0 0v-2m0 2v2" 
          stroke="#a78bfa" 
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "loop", ease: "easeInOut", delay: 0.5 }}
        />
      </svg>

      {/* Gaming Hexagon Pattern */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={`hex-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 30}px`,
              height: `${20 + Math.random() * 30}px`,
              opacity: 0.1 + Math.random() * 0.2,
              background: i % 2 === 0 ? '#6366f1' : '#a855f7',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              transform: `rotate(${Math.random() * 360}deg) translate(${mousePosition.x * -30}px, ${mousePosition.y * -30}px)`,
            }}
            animate={{
              opacity: [0.1 + Math.random() * 0.2, 0.3 + Math.random() * 0.2, 0.1 + Math.random() * 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Digital Code Rain Effect (Matrix-style) */}
      <div className="absolute inset-0" style={{ zIndex: 2, overflow: 'hidden' }}>
        {[...Array(20)].map((_, i) => {
          const startPos = Math.random() * 100;
          const speed = 20 + Math.random() * 80;
          return (
            <motion.div
              key={`code-${i}`}
              className="absolute text-xs font-mono"
              style={{
                left: `${startPos}%`,
                top: '-50px',
                color: i % 5 === 0 ? '#6366f1' : i % 5 === 1 ? '#8b5cf6' : '#10b981',
                opacity: 0.3 + Math.random() * 0.5,
                textShadow: i % 3 === 0 ? '0 0 5px #6366f1' : '0 0 5px #10b981',
              }}
              animate={{
                y: [0, window.innerHeight],
              }}
              transition={{
                duration: speed,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                delay: Math.random() * 5,
              }}
            >
              {[...Array(10)].map((_, j) => (
                <div key={`code-char-${i}-${j}`}>
                  {String.fromCharCode(48 + Math.floor(Math.random() * 74))}
                </div>
              ))}
            </motion.div>
          );
        })}
      </div>

      {/* Glowing Energy Lines */}
      {[...Array(15)].map((_, i) => {
        const isHorizontal = Math.random() > 0.5;
        const thickness = 1 + Math.random() * 2;
        const length = 100 + Math.random() * 200;
        return (
          <motion.div
            key={`energy-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: isHorizontal ? `${length}px` : `${thickness}px`,
              height: isHorizontal ? `${thickness}px` : `${length}px`,
              background: `linear-gradient(${Math.random() * 360}deg, ${
                i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#a855f7' : '#10b981'
              } 0%, transparent 100%)`,
              opacity: 0.4,
              boxShadow: `0 0 10px ${
                i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#a855f7' : '#10b981'
              }`,
              transform: `rotate(${Math.random() * 360}deg) translate(${mousePosition.x * -40}px, ${mousePosition.y * -40}px)`,
              zIndex: 3,
            }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
              boxShadow: [
                `0 0 5px ${i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#a855f7' : '#10b981'}`,
                `0 0 15px ${i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#a855f7' : '#10b981'}`,
                `0 0 5px ${i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#a855f7' : '#10b981'}`,
              ],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        );
      })}

      {/* Gaming Dots Grid (Like a radar/map overlay) */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
        style={{
          backgroundImage: "radial-gradient(circle, rgba(99, 102, 241, 0.3) 1px, transparent 1px)",
          backgroundSize: '30px 30px',
          transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`,
          zIndex: 2,
        }}
      />

      {/* Floating Gaming Icons */}
      {[...Array(8)].map((_, i) => {
        const icons = ['⌘', '⏏', '⌫', '⎇', '★', '♠', '♦', '⚔', '🎮', '🎯', '🏆'];
        const icon = icons[Math.floor(Math.random() * icons.length)];
        return (
          <motion.div
            key={`icon-${i}`}
            className="absolute text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              color: i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#a855f7' : '#10b981',
              opacity: 0.2,
              textShadow: `0 0 10px ${i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#a855f7' : '#10b981'}`,
              transform: `rotate(${Math.random() * 360}deg)`,
              zIndex: 3,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, Math.random() * 40 - 20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          >
            {icon}
          </motion.div>
        );
      })}

      {/* Light Beams */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`beam-${i}`}
          className="absolute"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: '-20%',
            width: '5px',
            height: '140%',
            background: `linear-gradient(to bottom, transparent 0%, ${
              i === 0 ? '#6366f1' : i === 1 ? '#a855f7' : '#10b981'
            } 50%, transparent 100%)`,
            opacity: 0.1,
            transform: `rotate(${Math.random() * 30 - 15}deg)`,
            zIndex: 2,
          }}
          animate={{
            opacity: [0.1, 0.5, 0.1],
            x: [0, Math.random() * 200 - 100, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Game HUD Elements */}
      <motion.div
        className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs"
        style={{ 
          border: '1px solid #6366f1',
          color: '#6366f1',
          background: 'rgba(15, 23, 42, 0.7)',
          zIndex: 10
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        LEVEL {Math.floor(Math.random() * 100)}
      </motion.div>

      <motion.div
        className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs"
        style={{ 
          border: '1px solid #10b981',
          color: '#10b981',
          background: 'rgba(15, 23, 42, 0.7)',
          zIndex: 10
        }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        ENERGY 100%
      </motion.div>

      {/* Gradient Overlay for Readability */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(5, 4, 23, 0) 0%, rgba(5, 4, 23, 0.9) 100%)",
          zIndex: 5,
        }}
      />

      {/* Main Content */}
      <div className="relative max-w-[1200px] mx-auto px-4 pt-12 pb-16 z-10">
        {/* Title with Gaming Style */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-[2.5rem] sm:text-[3rem] font-extrabold text-white tracking-tight"
            style={{ 
              textShadow: "0 0 15px rgba(99, 102, 241, 0.5)",
              letterSpacing: "1px"
            }}
          >
            FEATURED<span className="text-[#6366f1]">_</span>GAMES
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-1 bg-[#6366f1] mx-auto rounded-full"
            style={{ boxShadow: "0 0 10px #6366f1" }}
          />
        </div>

        {/* Carousel */}
        <div className="relative">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col lg:flex-row gap-8 items-center"
            >
              {/* Game Image with Enhanced Gaming Style */}
              <motion.div
                className="lg:w-1/2 relative rounded-lg overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
                style={{
                  boxShadow: "0 0 30px rgba(99, 102, 241, 0.4)",
                  border: "1px solid rgba(99, 102, 241, 0.4)",
                }}
              >
                <img
                  src={games[currentSlide].image}
                  alt={games[currentSlide].title}
                  className="w-full h-[300px] lg:h-[400px] object-cover"
                />
                
                {/* Cyberpunk-style Glitch Effect */}
                <motion.div
                  className="absolute inset-0 bg-[#6366f1] mix-blend-screen"
                  animate={{ opacity: [0, 0.1, 0, 0.05, 0] }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "loop",
                    times: [0, 0.2, 0.3, 0.45, 0.5],
                    ease: "easeInOut",
                    repeatDelay: Math.random() * 5 + 2,
                  }}
                />

                {/* Scanner Line */}
                <motion.div
                  className="absolute w-full h-[2px] bg-[#6366f1] left-0"
                  style={{ boxShadow: "0 0 10px #6366f1" }}
                  animate={{ 
                    top: ["-10%", "110%"],
                    opacity: [0.7, 0.7, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    times: [0, 0.9, 1],
                    ease: "linear",
                    delay: 1,
                  }}
                />

                {/* Price Tag with Gaming Style */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute top-4 right-4 bg-[#050417] bg-opacity-80 backdrop-blur-sm px-4 py-2 rounded-lg"
                  style={{ 
                    border: "1px solid rgba(99, 102, 241, 0.4)", 
                    boxShadow: "0 0 15px rgba(99, 102, 241, 0.4)" 
                  }}
                >
                  <div className="text-gray-400 text-sm line-through">{games[currentSlide].price}</div>
                  <div className="text-white font-bold">{games[currentSlide].discount}</div>
                </motion.div>
                
                {/* Category Tag with Gaming Style */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute bottom-4 left-4 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-sm font-medium px-4 py-1 rounded-full"
                  style={{ boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)" }}
                >
                  {games[currentSlide].category}
                </motion.div>
              </motion.div>

              {/* Game Details with Enhanced Gaming Style */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="lg:w-1/2 text-center lg:text-left"
              >
                {/* Game Label */}
                <motion.div
                  variants={itemVariants}
                  className="inline-block px-4 py-1 rounded-full bg-[#6366f1] bg-opacity-20 text-[#6366f1] text-sm font-semibold mb-4"
                  style={{ 
                    border: "1px solid rgba(99, 102, 241, 0.4)",
                    boxShadow: "0 0 10px rgba(99, 102, 241, 0.3)" 
                  }}
                >
                  {games[currentSlide].label}
                </motion.div>
                
                {/* Game Title with Futuristic Style */}
                <motion.h3
                  variants={itemVariants}
                  className="text-[2rem] sm:text-[2.5rem] lg:text-[3rem] font-bold text-white mb-4 tracking-tight"
                  style={{ 
                    textShadow: "0 0 20px rgba(255, 255, 255, 0.4)",
                    letterSpacing: "1px"
                  }}
                >
                  {games[currentSlide].title.split('').map((char, index) => (
                    <motion.span
                      key={index}
                      animate={{
                        textShadow: char === ' ' ? 'none' : [
                          "0 0 5px rgba(255, 255, 255, 0.1)",
                          "0 0 15px rgba(99, 102, 241, 0.6)",
                          "0 0 5px rgba(255, 255, 255, 0.1)"
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: index * 0.05,
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.h3>
                
                {/* Game Description */}
                <motion.p
                  variants={itemVariants}
                  className="text-gray-300 text-lg mb-6 max-w-[400px] mx-auto lg:mx-0"
                  style={{ textShadow: "0 0 10px rgba(0, 0, 0, 0.5)" }}
                >
                  {games[currentSlide].description}
                </motion.p>
                
                {/* Action Buttons with Gaming Style */}
                <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <motion.button
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 0 20px rgba(99, 102, 241, 0.7)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-semibold rounded-lg"
                    style={{ 
                      boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)",
                      border: "1px solid rgba(139, 92, 246, 0.5)"
                    }}
                  >
                    {games[currentSlide].buttonText}
                  </motion.button>
                  <motion.button
                    whileHover={{ 
                      scale: 1.05, 
                      borderColor: "#6366f1",
                      boxShadow: "0 0 15px rgba(99, 102, 241, 0.3)" 
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-[#050417] bg-opacity-40 backdrop-blur-sm text-white font-semibold rounded-lg"
                    style={{ 
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                      boxShadow: "0 0 10px rgba(99, 102, 241, 0.1)"
                    }}
                  >
                    View Details
                  </motion.button>
                </motion.div>
                
                {/* Indicator Dots with Gaming Style */}
                <motion.div
                  variants={itemVariants}
                  className="flex justify-center lg:justify-start mt-8 space-x-3"
                >
                  {games.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleManualChange(index)}
                      className={`h-3 rounded-full ${
                        currentSlide === index ? "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] w-8" : "bg-gray-700 w-3"
                      }`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        boxShadow: currentSlide === index ? "0 0 10px #6366f1" : "none",
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows with Gaming Style */}
          <motion.button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#050417] bg-opacity-60 backdrop-blur-sm p-4 rounded-full"
            whileHover={{ 
              scale: 1.1, 
              x: -5, 
              boxShadow: "0 0 20px rgba(99, 102, 241, 0.7)" 
            }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            style={{ 
              border: "1px solid rgba(99, 102, 241, 0.4)",
              zIndex: 20
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <motion.button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#050417] bg-opacity-60 backdrop-blur-sm p-4 rounded-full"
            whileHover={{ 
              scale: 1.1, 
              x: 5, 
              boxShadow: "0 0 20px rgba(99, 102, 241, 0.7)" 
            }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            style={{ 
              border: "1px solid rgba(99, 102, 241, 0.4)",
              zIndex: 20
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        {/* Floating Gaming Elements */}
        <motion.div
          className="absolute bottom-20 left-10 w-20 h-20"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.3, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ zIndex: 4 }}
        >
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 11h-4.5V6.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5V11H7.5c-.28 0-.5.22-.5.5s.22.5.5.5H12v4.5c0 .28.22.5.5.5s.5-.22.5-.5V12h4.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5z" fill="#6366f1" fillOpacity="0.5"/>
            <circle cx="12" cy="12" r="9" stroke="#6366f1" strokeOpacity="0.7" strokeWidth="0.5"/>
          </svg>
        </motion.div>

        <motion.div
          className="absolute top-40 right-20 w-16 h-16"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.2, 0],
            rotate: [0, -360]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
            delay: 5
          }}
          style={{ zIndex: 4 }}
        >
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#a855f7" strokeOpacity="0.6" strokeWidth="0.5"/>
          </svg>
        </motion.div>

        {/* Bottom Curve with Enhanced Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{ zIndex: 6 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="w-full h-full"
          >
            <path
              fill="#050417"
              fillOpacity="0.9"
              d="M0,64L60,58.7C120,53,240,43,360,48C480,53,600,75,720,80C840,85,960,75,1080,69.3C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
            />
          </svg>
        </motion.div>
        
        {/* Gaming Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-6 px-6 py-2 rounded-full bg-[#050417] bg-opacity-70 backdrop-blur-sm"
          style={{ 
            border: "1px solid rgba(99, 102, 241, 0.3)",
            boxShadow: "0 0 15px rgba(99, 102, 241, 0.2)",
            zIndex: 10
          }}
        >
          <div className="flex items-center text-xs">
            <motion.div 
              className="w-2 h-2 rounded-full bg-green-500 mr-2"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-gray-300">ONLINE: 2.3K</span>
          </div>
          <div className="text-xs text-gray-300">|</div>
          <div className="flex items-center text-xs">
            <motion.div 
              className="w-2 h-2 rounded-full bg-purple-500 mr-2"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
            <span className="text-gray-300">TOP DEALS: 125</span>
          </div>
          <div className="text-xs text-gray-300">|</div>
          <div className="flex items-center text-xs">
            <motion.div 
              className="w-2 h-2 rounded-full bg-blue-500 mr-2"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
            />
            <span className="text-gray-300">NEW GAMES: 18</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Banner;