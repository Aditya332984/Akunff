import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { HiLockClosed, HiUser, HiShieldCheck } from 'react-icons/hi';
import { motion } from 'framer-motion';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(username, password, false, null, true); // isAdmin = true
      toast.success('Login successful');
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050417] relative overflow-hidden">
      {/* Background effects */}
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
      
      <div className="w-full max-w-md px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-6">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="h-20 w-20 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-2xl flex items-center justify-center shadow-lg"
            >
              <HiShieldCheck className="h-12 w-12 text-white" />
            </motion.div>
          </div>
          <h1 className="text-white text-4xl font-bold mb-2">Admin Portal</h1>
          <p className="text-indigo-200">Secure access to administration dashboard</p>
        </motion.div>
      
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-[#6366f1]/30"
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Welcome Back</h2>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-900/30 text-red-200 p-4 rounded-lg mb-6 flex items-center border border-red-500/50"
              >
                <span className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full bg-red-800/50 text-red-200">!</span>
                <span className="ml-3">{error}</span>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-indigo-200 text-sm font-medium mb-2">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiUser className="h-5 w-5 text-indigo-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 block w-full py-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-indigo-200 text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiLockClosed className="h-5 w-5 text-indigo-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 block w-full py-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-white bg-gradient-to-r from-[#6366f1] to-[#a855f7] hover:from-[#4f46e5] hover:to-[#9333ea] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  'Access Dashboard'
                )}
              </motion.button>
            </form>
          </div>
          
          <div className="px-8 py-4 bg-gray-800/50 border-t border-gray-700/50 text-center">
            <p className="text-sm text-indigo-300 flex items-center justify-center">
              <HiShieldCheck className="h-4 w-4 mr-2" />
              Protected area. Authorized personnel only.
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
        >
          <p className="text-xs text-indigo-300/60">
            © {new Date().getFullYear()} Aknuff Admin System
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminLogin;