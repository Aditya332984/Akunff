import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import ProductSelling from './pages/ProductSelling';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Chat from './pages/Chat';
import ChatsList from './pages/ChatsList';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Settings from './pages/Setting';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/elite-pass-season-15/products" element={<ProductListing />} />
          <Route path="/ultimate-bundle/products" element={<ProductListing />} />
          <Route path="/premium-skins-pack/products" element={<ProductListing />} />
          <Route path="/booster-pack/products" element={<ProductListing />} />
          <Route path="/diamonds/products" element={<ProductListing />} />
          <Route path="/mobile-legends" element={<ProductListing />} />
          <Route path="/steam-wallet" element={<ProductListing />} />
          <Route path="/pubg-mobile" element={<ProductListing />} />
          <Route path="/playstation-store" element={<ProductListing />} />
          <Route path="/garena-free-fire-accounts" element={<ProductListing />} />
          <Route path="/valorant" element={<ProductListing />} />
          <Route path="/roblox" element={<ProductListing />} />
          <Route path="/nintendo-eshop" element={<ProductListing />} />
          
          {/* Dynamic route for search terms - this will catch any path */}
          <Route path="/:searchTerm" element={<ProductListing />} />
          
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route
            path="/sell-accounts"
            element={
              <ProtectedRoute requiredRole="user">
                <ProductSelling />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute requiredRole="user">
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute requiredRole="user">
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:sellerId"
            element={
              <ProtectedRoute requiredRole="user">
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chats"
            element={
              <ProtectedRoute requiredRole="user">
                <ChatsList />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute requiredRole="user">
                <Settings/>
              </ProtectedRoute>
            }
          />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;