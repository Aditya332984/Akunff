import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductListing from './pages/ProductListing';
import ProtectedRoute from './components/ProtectedRoute';
import RouteTitleHandler from './components/RouteTitleHandler';

// Lazy load non-critical routes
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const ProductSelling = lazy(() => import('./pages/ProductSelling'));
const Profile = lazy(() => import('./pages/Profile'));
const Cart = lazy(() => import('./pages/Cart'));
const Chat = lazy(() => import('./pages/Chat'));
const ChatsList = lazy(() => import('./pages/ChatsList'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Settings = lazy(() => import('./pages/Setting'));

// Loading fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen bg-[#0f172a]">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#6366f1]"></div>
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <RouteTitleHandler/>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<ProductListing />} />
            
            {/* Category routes - grouped for better organization */}
            {[
              "/garena-free-fire-elite-pass-akun",
              "/garena-free-fire-get-skin-emotes-akun",
              "/redeem-kode-free-fire",
              "/free-fire-server-akun",
              "/garena-diamonds-free-fire-max",
              "/mobile-legends",
              "/steam-wallet",
              "/pubg-mobile",
              "/playstation-store",
              "/garena-free-fire-accounts",
              "/valorant-account-for-sale",
              "/roblox",
              "/nintendo-eshop"
            ].map(path => (
              <Route key={path} path={path} element={<ProductListing />} />
            ))}
            
            <Route path="/product/:id" element={<ProductDetail />} />
            
            {/* Protected routes */}
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
            
            {/* Admin routes */}
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
            
            {/* Dynamic route for search terms - this will catch any path */}
            <Route path="/:searchTerm" element={<ProductListing />} />
          </Routes>
        </Suspense>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;