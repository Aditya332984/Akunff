import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { FaShoppingCart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
    const { fetchCartData } = useCart();
    const { user } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL;

    const handleAddToCart = async () => {
        if (!user) {
            toast.error('Please login to add items to cart');
            return;
        }

        try {
            await axios.post(
                `${API_URL}/cart/add`,
                { productId: product.id, quantity: 1 },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );
            fetchCartData();
            toast.success(`${product.name} added to cart!`);
        } catch (error) {
            toast.error('Failed to add to cart');
        }
    };

    return (
        <motion.div 
            className="relative rounded-xl overflow-hidden border border-[#6366f1]/20 shadow-xl bg-gray-900/90 backdrop-blur-sm w-full h-[380px] flex flex-col transition-shadow duration-300 hover:shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{
                scale: 1.04,
                boxShadow: "0 0 25px rgba(99, 102, 241, 0.6)",
                borderColor: "rgba(168, 85, 247, 0.6)",
            }}
        >
            {/* Badge - Positioned outside the image */}
            {product.discount && (
                <div className="absolute top-3 right-3 z-20">
                    <span className="text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-600 px-3 py-1 rounded-full shadow-lg">
                        {product.discount}
                    </span>
                </div>
            )}
            
            {/* Background Image with Glass Morphism */}
            <div className="relative w-full h-56 overflow-hidden flex-shrink-0">
                <motion.div
                    className="w-full h-full bg-center bg-cover transition-all duration-700"
                    style={{
                        backgroundImage: `url(${product.image || 'https://via.placeholder.com/300x200'})`,
                    }}
                    whileHover={{ scale: 1.1 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/70 to-transparent" />
            </div>
            
            {/* Content with Glass Effect */}
            <div className="relative p-5 backdrop-blur-sm flex-grow flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 line-clamp-1">
                        {product.name}
                    </h3>
                    <p className="mt-2 text-sm text-gray-300 line-clamp-2">{product.description}</p>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
                        ${product.price}
                    </p>
                    
                    <motion.button
                        onClick={handleAddToCart}
                        className="flex items-center space-x-2 py-2 px-4 text-white font-medium rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] shadow-lg shadow-purple-500/20 transition-transform duration-200 hover:scale-105 ml-4"
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)",
                        }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FaShoppingCart />
                        <span>Add</span>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
