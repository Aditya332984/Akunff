// client/src/context/CartContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const fetchCartData = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get(`${API_URL}/cart/count`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCartCount(response.data.cartCount || 0);
      setNotificationCount(response.data.notificationCount || 0);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setCartCount(0);
      setNotificationCount(0);
    }
  };

  useEffect(() => {
    fetchCartData();
    const interval = setInterval(fetchCartData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, notificationCount, fetchCartData }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);