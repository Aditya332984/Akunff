import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Chat = () => {
  const { sellerId: paramSellerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [chattingWith, setChattingWith] = useState('Loading...');
  const [socket, setSocket] = useState(null);
  const messagesContainerRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const token = localStorage.getItem('token');

  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get('productId');
  const sellerId = paramSellerId;

  useEffect(() => {
    if (!token || !user.id) {
      navigate('/login');
      return;
    }

    if (!sellerId || !productId) {
      navigate('/products');
      return;
    }

    const initializeChat = async () => {
      try {
        const [sellerResponse, messagesResponse] = await Promise.all([
          axios.get(`${API_URL}/auth/user/${sellerId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/messages/${productId}/${sellerId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (sellerResponse.data && sellerResponse.data.name) {
          setChattingWith(sellerResponse.data.name);
        } else {
          setChattingWith('Unknown Seller');
        }

        setMessages(
          messagesResponse.data.map((msg) => ({
            id: msg._id,
            sender: msg.sender.name,
            text: msg.message,
            time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isReceived: msg.sender._id !== user.id,
          }))
        );
      } catch (error) {
        console.error('Error initializing chat:', error);
        setChattingWith('Unknown Seller');
      }
    };

    initializeChat();

    const ws = new WebSocket(`ws://localhost:3000?token=${token}&productId=${productId}`);
    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setSocket(ws);
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'chat' && data.productId === productId) {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sender: data.sender.name,
            text: data.message,
            time: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isReceived: data.sender.userId !== user.id,
          },
        ]);
      } else if (data.type === 'welcome') {
        console.log(data.message);
      }
    };
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };
    ws.onerror = (error) => console.error('WebSocket error:', error);

    return () => ws.close();
  }, [sellerId, productId, user.id, token, navigate]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !sellerId || !productId) return;

    const message = { message: newMessage, recipient: sellerId, timestamp: new Date().toISOString() };
    socket.send(JSON.stringify(message));
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: 'You',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isReceived: false,
      },
    ]);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-white relative overflow-hidden">
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at center, rgba(99,102,241,0.3), transparent 70%)", opacity: 0.4 }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          className="max-w-5xl mx-auto bg-gray-900/90 rounded-2xl border border-[#6366f1]/30 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-[#1e293b] to-[#1e1e3a] p-4 border-b border-[#6366f1]/30 flex items-center justify-between">
            <div className="flex items-center">
              <motion.div
                className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white font-bold"
                whileHover={{ scale: 1.1 }}
              >
                {chattingWith.charAt(0)}
              </motion.div>
              <div className="ml-3">
                <h3 className="font-bold text-white">{chattingWith}</h3>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                  <span className="text-xs text-gray-400">{isConnected ? 'Online' : 'Offline'}</span>
                </div>
              </div>
            </div>
          </div>
          <div ref={messagesContainerRef} className="h-[60vh] overflow-y-auto p-6 bg-[#0f172a]/90">
            {messages.length === 0 && <p className="text-gray-400 text-center">No messages yet. Start chatting!</p>}
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`mb-4 flex ${message.isReceived ? 'justify-start' : 'justify-end'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`max-w-[80%] ${message.isReceived ? 'order-2' : 'order-1'}`}>
                  {message.isReceived && <div className="text-xs text-gray-400 mb-1 ml-2">{message.sender}</div>}
                  <motion.div
                    className={`rounded-2xl px-4 py-3 ${message.isReceived ? 'bg-gray-700 text-gray-100' : 'bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white'}`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <p>{message.text}</p>
                    <div className={`text-xs mt-1 ${message.isReceived ? 'text-gray-400' : 'text-indigo-200'} text-right`}>{message.time}</div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="bg-[#1e293b] p-4 border-t border-[#6366f1]/30">
            <div className="flex items-center">
              <input
                type="text"
                className="flex-grow bg-gray-800 text-white rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={!sellerId || !productId}
              />
              <motion.button
                type="submit"
                className="ml-3 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full w-10 h-10 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                disabled={!newMessage.trim() || !isConnected}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                </svg>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Chat;