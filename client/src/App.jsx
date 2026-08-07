import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import CartDrawer from './components/CartDrawer';
import JwtTokenInspector from './components/JwtTokenInspector';
import SmoothScroll from './components/SmoothScroll';
import ProtectedRoute from './components/ProtectedRoute';

import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { useSocketStore } from './store/useSocket';
import { useWishlistStore } from './store/useWishlistStore';

import Home from './pages/Home';
import Menu from './pages/Menu';
import CustomCakeBuilder from './pages/CustomCakeBuilder';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Favorites from './pages/Favorites';

import CustomerLogin from './pages/CustomerLogin';
import CustomerRegister from './pages/CustomerRegister';
import CustomerOrders from './pages/CustomerOrders';
import CustomerProfile from './pages/CustomerProfile';
import TrackOrder from './pages/TrackOrder';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBanners from './pages/admin/AdminBanners';

import NotFound from './pages/NotFound';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const initTheme = useThemeStore((state) => state.initTheme);
  const connectSocket = useSocketStore((state) => state.connect);
  const syncUserFavorites = useWishlistStore((state) => state.syncUserFavorites);

  useEffect(() => {
    checkAuth().then(() => {
      syncUserFavorites();
    });
    initTheme();
    connectSocket();
  }, [checkAuth, initTheme, connectSocket, syncUserFavorites]);

  return (
    <Router>
      <ScrollToTop />
      <SmoothScroll>
        <div className="flex flex-col min-h-screen bg-[#0d0d11] text-gray-100 selection:bg-amber-500 selection:text-slate-950">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Storefront Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/custom-cake" element={<CustomCakeBuilder />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/track-order" element={<TrackOrder />} />

              {/* Customer Auth Routes */}
              <Route path="/login" element={<CustomerLogin />} />
              <Route path="/register" element={<CustomerRegister />} />
              <Route 
                path="/my-orders" 
                element={
                  <ProtectedRoute allowedRoles={['customer', 'admin', 'receptionist']}>
                    <CustomerOrders />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute allowedRoles={['customer', 'admin', 'receptionist']}>
                    <CustomerProfile />
                  </ProtectedRoute>
                } 
              />

              {/* Legacy admin login redirect to unified login */}
              <Route path="/admin/login" element={<Navigate to="/login" replace />} />

              {/* Staff & Admin RBAC Protected Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/products" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
                    <AdminProducts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/orders" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
                    <AdminOrders />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminUsers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/banners" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminBanners />
                  </ProtectedRoute>
                } 
              />

              {/* 404 Catch-All Fallback Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <CartDrawer />
          <WhatsAppButton />
          <JwtTokenInspector />
        </div>
      </SmoothScroll>
    </Router>
  );
}
