import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HiUsers, HiDocumentText, HiChartBar, HiCurrencyDollar } from 'react-icons/hi';
import AdminStats from '../components/AdminStats';
import UserManagement from '../components/UserManagement';
import PostManagement from '../components/PostManagement';

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

function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, posts: 0, revenue: 0 });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setStats(data);
    };
    fetchStats();
  }, []);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <HiChartBar className="w-5 h-5" /> },
    { id: 'users', name: 'Users', icon: <HiUsers className="w-5 h-5" /> },
    { id: 'posts', name: 'Posts', icon: <HiDocumentText className="w-5 h-5" /> },
  ];

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
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`hex-${i}`}
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

      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] shadow-lg relative z-10">
        <div className="container mx-auto px-6 py-8">
          <motion.h1 
            className="text-4xl font-extrabold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textShadow: "0 0 15px rgba(255, 255, 255, 0.5)" }}
          >
            Admin Dashboard
          </motion.h1>
          <motion.p 
            className="mt-2 text-indigo-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Manage your gaming platform's users and content
          </motion.p>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-8 flex-grow relative z-10">
        <div className="mb-8 border-b border-[#6366f1]/30">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center pb-4 px-1 ${
                  activeTab === tab.id
                    ? 'border-b-2 border-[#a855f7] text-[#a855f7] font-medium'
                    : 'text-gray-300 hover:text-white'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.icon}
                <span className="ml-2">{tab.name}</span>
              </motion.button>
            ))}
          </nav>
        </div>

        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent"
            style={{ textShadow: "0 0 15px rgba(99, 102, 241, 0.5)" }}>
              Platform Overview
            </h2>
            
            <SectionAnimation>
              <AdminStats stats={stats} />
            </SectionAnimation>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <SectionAnimation delay={0.2}>
                <div className="bg-gray-900/80 rounded-xl p-6 border border-[#6366f1]/30 shadow-lg">
                  <h3 className="text-xl font-bold mb-4 text-white">User Management</h3>
                  <UserManagement compact={true} />
                </div>
              </SectionAnimation>
              
              <SectionAnimation delay={0.4}>
                <div className="bg-gray-900/80 rounded-xl p-6 border border-[#6366f1]/30 shadow-lg">
                  <h3 className="text-xl font-bold mb-4 text-white">Post Management</h3>
                  <PostManagement compact={true} />
                </div>
              </SectionAnimation>
            </div>
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent"
            style={{ textShadow: "0 0 15px rgba(99, 102, 241, 0.5)" }}>
              User Management
            </h2>
            
            <SectionAnimation>
              <div className="bg-gray-900/80 rounded-xl p-6 border border-[#6366f1]/30 shadow-lg">
                <UserManagement />
              </div>
            </SectionAnimation>
          </motion.div>
        )}

        {activeTab === 'posts' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent"
            style={{ textShadow: "0 0 15px rgba(99, 102, 241, 0.5)" }}>
              Post Management
            </h2>
            
            <SectionAnimation>
              <div className="bg-gray-900/80 rounded-xl p-6 border border-[#6366f1]/30 shadow-lg">
                <PostManagement />
              </div>
            </SectionAnimation>
          </motion.div>
        )}
        
    
      </div>
    </div>
  );
}

export default AdminDashboard;