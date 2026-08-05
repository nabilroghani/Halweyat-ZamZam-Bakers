import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { FiShoppingBag, FiMenu, FiX, FiUser, FiPhoneCall, FiPieChart, FiLogOut } from 'react-icons/fi';

export default function Navbar() {
  const { toggleCart, getTotalItemsCount } = useCartStore();
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItemsCount = getTotalItemsCount();
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu & Sweets', path: '/menu' },
    { name: 'Custom Cake Studio', path: '/custom-cake' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0d0d11]/90 backdrop-blur-md border-b border-amber-500/20 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-[1px] shadow-lg group-hover:shadow-amber-500/30 transition">
              <div className="w-full h-full bg-[#121216] rounded-xl flex items-center justify-center font-serif text-2xl font-black text-amber-400">
                Z
              </div>
            </div>
            <div>
              <span className="block text-lg font-extrabold font-serif tracking-wider gold-gradient-text">
                HALWIYAT ZAMZAM
              </span>
              <span className="block text-[10px] tracking-[0.2em] text-amber-200/60 uppercase font-sans">
                Bakers & Sweets • Timergara
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold tracking-wide transition-colors ${
                  isActive(link.path)
                    ? 'text-amber-400 border-b-2 border-amber-400 pb-1'
                    : 'text-gray-300 hover:text-amber-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-4">
            
            <a 
              href="tel:+923459000123" 
              className="hidden lg:flex items-center gap-2 text-xs text-amber-300/80 bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/20 hover:border-amber-500/40 transition"
            >
              <FiPhoneCall className="text-amber-400" />
              <span>0345 9000123</span>
            </a>

            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'admin' || user.role === 'receptionist' ? (
                  <Link 
                    to="/admin/dashboard"
                    className="flex items-center gap-2 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-2 rounded-lg hover:bg-amber-500/30 transition"
                  >
                    <FiPieChart /> {user.role.toUpperCase()} Portal
                  </Link>
                ) : (
                  <Link 
                    to="/my-orders"
                    className="flex items-center gap-2 text-xs font-bold bg-[#181820] text-amber-400 border border-amber-500/30 px-3 py-2 rounded-lg hover:bg-amber-500/10 transition"
                  >
                    <FiUser /> {user.name.split(' ')[0]} (My Orders)
                  </Link>
                )}
                <button 
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-400 text-sm transition"
                  title="Sign Out"
                >
                  <FiLogOut />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link 
                  to="/login"
                  className="text-xs font-semibold text-gray-300 hover:text-amber-400 transition"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register"
                  className="text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-lg hover:bg-amber-500 hover:text-slate-950 transition"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Cart Trigger Button */}
            <button
              onClick={toggleCart}
              className="relative p-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-xl font-bold hover:shadow-lg hover:shadow-amber-500/30 transition flex items-center justify-center"
              aria-label="View Cart"
            >
              <FiShoppingBag className="text-xl" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[11px] font-black w-6 h-6 rounded-full border-2 border-[#0d0d11] flex items-center justify-center shadow-md animate-bounce">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-amber-400 text-2xl"
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121216] border-b border-amber-500/20 px-6 pt-4 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-base font-semibold border-b border-white/5 ${
                isActive(link.path) ? 'text-amber-400 font-bold' : 'text-gray-300'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="pt-3 space-y-2 border-t border-amber-500/10">
            {user ? (
              <div className="flex justify-between items-center text-xs text-amber-300">
                <span>Signed in as: <strong>{user.name}</strong> ({user.role})</span>
                <button onClick={logout} className="text-red-400 font-bold underline">Logout</button>
              </div>
            ) : (
              <div className="flex justify-between items-center text-xs">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-amber-400 font-bold">Sign In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 underline">Register Account</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
