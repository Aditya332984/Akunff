import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim() !== '' && emailInput.includes('@')) {
      setIsSubscribed(true);
      setEmailInput('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
    hover: { 
      x: 5, 
      color: '#a78bfa',
      textShadow: '0 0 10px rgba(167, 139, 250, 0.5)',
      transition: { duration: 0.3 },
    },
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: '0 0 20px rgba(99, 102, 241, 0.7)',
      transition: { type: 'spring', stiffness: 300 },
    },
    tap: { scale: 0.95 },
  };

  const socialIconVariants = {
    hover: { 
      scale: 1.2,
      rotate: 10,
      color: '#6366f1',
      transition: { type: 'spring', stiffness: 300 },
    },
  };

  return (
    <footer 
      className="relative bg-[#0f172a] text-white py-16 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #050417 100%)',
        borderTop: '1px solid rgba(99, 102, 241, 0.3)',
      }}
    >
      {/* Cyberpunk Background Effects */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
        />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`hex-footer-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 30}px`,
              height: `${20 + Math.random() * 30}px`,
              opacity: 0.1 + Math.random() * 0.2,
              background: i % 2 === 0 ? '#6366f1' : '#a855f7',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }}
            animate={{
              opacity: [0.1 + Math.random() * 0.2, 0.3 + Math.random() * 0.2, 0.1 + Math.random() * 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Newsletter Section */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 pb-8 border-b border-[#6366f1]/20 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent"
              style={{ textShadow: '0 0 15px rgba(99, 102, 241, 0.5)' }}
            >
              Stay Updated with Aknuff
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-gray-300 mb-6"
              style={{ textShadow: '0 0 10px rgba(0, 0, 0, 0.5)' }}
            >
              Get the latest news, updates, and special offers directly to your inbox.
            </motion.p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Your email address"
                className="px-4 py-2 rounded-full bg-gray-900/80 border border-[#6366f1]/30 focus:border-[#a855f7] focus:outline-none focus:ring-2 focus:ring-[#a855f7] flex-grow max-w-sm text-white placeholder-gray-400"
                required
                whileFocus={{ 
                  scale: 1.02,
                  boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
                }}
              />
              <motion.button
                type="submit"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="px-6 py-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full font-medium text-white"
                style={{ boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)' }}
              >
                Subscribe
              </motion.button>
            </form>
            {isSubscribed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 text-green-400"
                style={{ textShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}
              >
                Thanks for subscribing!
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Main Footer Sections */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          {/* Support Section */}
          <div className="footer-section">
            <motion.h3
              variants={itemVariants}
              className="text-xl font-bold mb-5 relative"
            >
              <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                Support
              </span>
              <motion.span
                className="absolute bottom-0 left-0 w-12 h-1 bg-[#6366f1] rounded"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
              />
            </motion.h3>
            <ul className="space-y-3">
              {['Help Center', 'FAQ', 'Report an Issue'].map((item) => (
                <motion.li key={item} variants={itemVariants} whileHover="hover">
                  <a href="#" className="inline-block transition duration-200">
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Aknuff Section */}
          <div className="footer-section">
            <motion.h3
              variants={itemVariants}
              className="text-xl font-bold mb-5 relative"
            >
              <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                Aknuff
              </span>
              <motion.span
                className="absolute bottom-0 left-0 w-12 h-1 bg-[#6366f1] rounded"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
              />
            </motion.h3>
            <ul className="space-y-3">
              {[
                'About Aknuff',
                'Brand Identity',
                'Contact Us',
                'Terms of Service',
                'Refund Policy',
                'Privacy Policy',
                'Manage Cookies',
                'Career',
              ].map((item) => (
                <motion.li key={item} variants={itemVariants} whileHover="hover">
                  <a href="#" className="inline-block transition duration-200">
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Buyer Section */}
          <div className="footer-section">
            <motion.h3
              variants={itemVariants}
              className="text-xl font-bold mb-5 relative"
            >
              <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                Buyer
              </span>
              <motion.span
                className="absolute bottom-0 left-0 w-12 h-1 bg-[#6366f1] rounded"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
              />
            </motion.h3>
            <ul className="space-y-3">
              {[
                'How to Shop',
                'How to Trade',
                'Payment Method',
                'Buyer Protection',
                'Loyalty Rewards',
              ].map((item) => (
                <motion.li key={item} variants={itemVariants} whileHover="hover">
                  <a href="#" className="inline-block transition duration-200">
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Connect With Us Section */}
          <div className="footer-section">
            <motion.h3
              variants={itemVariants}
              className="text-xl font-bold mb-5 relative"
            >
              <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                Connect With Us
              </span>
              <motion.span
                className="absolute bottom-0 left-0 w-12 h-1 bg-[#6366f1] rounded"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
              />
            </motion.h3>

            <motion.div variants={itemVariants} className="mb-6">
              <p className="text-gray-300 mb-2">Follow us on social media:</p>
              <div className="flex space-x-4">
                {[
                  { icon: 'facebook', path: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z', color: '#3b82f6' },
                  { icon: 'instagram', path: 'M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z', color: '#ec4899' },
                  { icon: 'twitter', path: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84', color: '#0ea5e9' },
                  { icon: 'youtube', path: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z', color: '#ef4444' },
                ].map((social) => (
                  <motion.a
                    key={social.icon}
                    href="#"
                    variants={socialIconVariants}
                    whileHover="hover"
                    className="text-gray-300 transition duration-200"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d={social.path} clipRule="evenodd" />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <p className="text-gray-300 mb-2">Download our app:</p>
              <div className="flex flex-col sm:flex-row gap-3">
                {[
                  { name: 'App Store', icon: 'M17.9 6.05c-.91.41-1.96.71-3.11.84-1.54.15-2.9-.34-3.9-1.27-.83-.79-1.44-1.86-1.62-3.09-.02-.17-.11-.28-.27-.28-.14 0-.25.09-.29.22-.26.97-.05 2.03.5 3.13-1.35-.13-2.46-.42-3.32-.9-.26-.14-.54.09-.48.37.11.46.31.89.6 1.27-1.11-.01-2.08-.36-2.91-.86-.27-.16-.58.04-.56.33.06.76.35 1.47.86 2.08-.88.09-1.64-.07-2.4-.43-.3-.14-.63.11-.55.43.35.88.99 1.65 1.84 2.21-.65.18-1.3.24-2 .19-.35-.03-.56.36-.3.6.82.72 1.83 1.25 3.07 1.53L4 13c-.67.32-1.13.95-1.13 1.7v.28c0 1.11.89 2.02 2 2.02h14.25c1.11 0 2-.91 2-2.02V11.7c0-.74-.46-1.38-1.13-1.69l-2.09-.73z' },
                  { name: 'Google Play', icon: 'M5.43 4.08c-1.67.78-2.76 2.48-2.42 4.28.09 1.18.63 2.25 1.5 3.03.3.26.62.5.96.73-.17.54-.34 1.07-.51 1.61-.16.53-.34 1.07-.48 1.62-.21.8-.36 1.62-.38 2.45-.03.71.14 1.43.51 2.04.36.6.88 1.08 1.49 1.45.65.37 1.35.67 2.04.93.37.14.79-.03.99-.36.07-.12.12-.25.15-.38.1-.5-.2-.99-.7-1.13l-.13-.04c-.5-.21-1.01-.46-1.5-.77-.44-.28-.75-.62-.82-1.12-.03-.32 0-.63.08-.94.17-.69.43-1.34.69-1.98.16-.39.32-.75.45-1.11.45.21.92.38 1.39.53.25.08.51.15.77.21.31.08.62.15.94.21.32.06.65.11.98.15.33.04.66.06.99.09l1.11.05c.51.02 1.04.02 1.58-.02.79-.04 1.57-.16 2.35-.32.38-.08.76-.18 1.14-.29.39-.12.77-.25 1.15-.39.73-.29 1.45-.65 2.12-1.07.25-.16.49-.34.72-.52.23-.18.46-.38.66-.6.29-.31.56-.65.75-1.03.19-.38.31-.81.31-1.25 0-.21-.03-.43-.08-.65-.08-.31-.20-.61-.37-.88-.3-.49-.7-.9-1.14-1.25-.44-.35-.93-.63-1.45-.86-.03-.01-.05-.02-.08-.03.38-.94.37-1.98-.04-2.85-.49-1.04-1.4-1.74-2.23-2.39-.83-.66-1.76-1.25-2.75-1.74-.5-.25-1.01-.46-1.53-.65-.52-.18-1.05-.34-1.6-.45zM13.09 2.4c.56.19 1.09.41 1.6.65.94.47 1.82 1.02 2.6 1.64.76.6 1.53 1.25 1.87 2.02.25.57.25 1.2-.02 1.76-.22.45-.57.8-.97 1.08-.34.24-.71.45-1.08.64-.36.18-.73.34-1.11.48-.75.29-1.52.52-2.3.69-.75.17-1.5.27-2.28.32-.46.03-.93.03-1.41.01-.1 0-.57-.02-1.12-.05-.32-.02-.64-.04-.96-.08-.32-.03-.63-.08-.94-.13-.27-.05-.54-.11-.8-.18-.27-.07-.54-.15-.8-.24-.55-.19-1.08-.4-1.58-.67-.52-.28-1.02-.62-1.38-1.05-.36-.44-.59-.95-.68-1.5-.36-2.17 1.29-4.54 3.54-5.89 1.01-.6 2.13-1.11 3.3-1.4.59-.14 1.21-.23 1.84-.24.62-.01 1.26.06 1.9.21z' },
                ].map((app) => (
                  <motion.a
                    key={app.name}
                    href="#"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="bg-gray-900/80 border border-[#6366f1]/30 px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-200"
                  >
                    <svg className="w-6 h-6 text-[#6366f1]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d={app.icon} />
                    </svg>
                    <span className="text-gray-300">{app.name}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 pt-6 border-t border-[#6366f1]/20"
        >
          {/* Payment Methods */}
          <motion.div variants={itemVariants} className="mb-6 text-center">
            <p className="text-sm text-gray-400 mb-3">Secure Payment Methods</p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Visa', 'Mastercard', 'PayPal', 'Bank Transfer', 'e-Wallet'].map((method) => (
                <motion.span
                  key={method}
                  whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)' }}
                  className="px-3 py-1 bg-gray-900/80 border border-[#6366f1]/30 rounded-full text-xs text-gray-300"
                >
                  {method}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Language Selector */}
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <motion.select
              className="bg-gray-900/80 text-white px-4 py-2 rounded-lg border border-[#6366f1]/30 focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
              whileHover={{ boxShadow: '0 0 15px rgba(99, 102, 241, 0.3)' }}
            >
              <option value="en">English</option>
              <option value="id">Bahasa Indonesia</option>
              <option value="ms">Bahasa Melayu</option>
              <option value="th">ภาษาไทย</option>
            </motion.select>
          </motion.div>

          {/* Copyright */}
          <motion.div variants={itemVariants} className="text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Aknuff. All rights reserved.</p>
            <p className="mt-2">Aknuff is a trademark of PT. Five Jack.</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Cyberpunk Glow Overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
          opacity: 0.3,
        }}
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
      />
    </footer>
  );
};

export default Footer;