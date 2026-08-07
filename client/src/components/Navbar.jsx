import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { 
  FiShoppingBag, FiMenu, FiX, FiUser, FiPieChart, FiLogOut, 
  FiBox, FiUsers, FiGlobe, FiPackage, FiImage, FiSun, FiMoon, FiKey, FiUserPlus, FiChevronDown, FiHeart
} from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa6';

export default function Navbar() {
  const { toggleCart, getTotalItemsCount } = useCartStore();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { favorites, getTotalFavoritesCount } = useWishlistStore();
  const totalFavoritesCount = getTotalFavoritesCount();

  const totalItemsCount = getTotalItemsCount();
  const isActive = (path) => location.pathname === path;
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu & Sweets', path: '/menu' },
    { name: 'Custom Cake Studio', path: '/custom-cake' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const isReceptionist = user?.role === 'receptionist';

  const adminNavLinks = isReceptionist
    ? [
        { name: 'Counter Orders Desk', path: '/admin/orders', icon: <FiShoppingBag /> },
        { name: 'Menu Catalog & Stock', path: '/admin/products', icon: <FiBox /> }
      ]
    : [
        { name: 'Executive Dashboard', path: '/admin/dashboard', icon: <FiPieChart /> },
        { name: 'Product Catalog', path: '/admin/products', icon: <FiBox /> },
        { name: 'Live Orders Desk', path: '/admin/orders', icon: <FiShoppingBag /> },
        { name: 'Hero Banners Slider', path: '/admin/banners', icon: <FiImage /> },
        { name: 'Staff & RBAC Users', path: '/admin/users', icon: <FiUsers /> }
      ];

  // If inside Admin Panel, render dedicated Operations Topbar
  if (isAdminRoute) {
    return (
      <header className="sticky top-0 z-40 bg-[#121216]/95 backdrop-blur-md border-b border-amber-500/30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo (Role Dependent) */}
            <Link to={isReceptionist ? "/admin/orders" : "/admin/dashboard"} className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-[1px] shadow-lg">
                <div className="w-full h-full bg-[#181820] rounded-xl flex items-center justify-center font-serif text-xl font-black text-amber-400">
                  {isReceptionist ? 'R' : 'Z'}
                </div>
              </div>
              <div>
                <span className="block text-sm font-extrabold font-serif tracking-wider gold-gradient-text">
                  {isReceptionist ? 'RECEPTIONIST DESK' : 'ZAMZAM EXECUTIVE'}
                </span>
                <span className="block text-[9px] tracking-[0.2em] text-amber-300/60 uppercase font-sans">
                  {isReceptionist ? 'Counter Billing & Expediting' : 'Manager Operations Console'}
                </span>
              </div>
            </Link>

            {/* Desktop Admin Nav Links */}
            <nav className="hidden md:flex items-center gap-6">
              {adminNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 text-xs font-bold transition-all px-3 py-1.5 rounded-lg ${
                    isActive(link.path)
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'text-gray-300 hover:text-amber-300 hover:bg-white/5'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
            </nav>

            {/* Right Admin Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? <FiSun className="text-base" /> : <FiMoon className="text-base" />}
              </button>

              <Link
                to="/"
                target="_blank"
                className="hidden sm:flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 hover:bg-amber-500/20 transition font-semibold"
                title="Open customer storefront in new tab"
              >
                <FiGlobe className="text-amber-400" />
                <span>Storefront ↗</span>
              </Link>

              {/* Staff / Admin Role Avatar Badge */}
              <div className="hidden sm:flex items-center gap-2 bg-[#181820] border border-amber-500/30 px-3 py-1 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black text-xs flex items-center justify-center font-serif">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                  {user?.role || 'STAFF'}
                </span>
              </div>

              {/* Professional Sign Out Action Button */}
              <button
                onClick={logout}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-red-500/15 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500 hover:text-white font-extrabold text-xs transition shadow-md"
                title="Sign Out of Operations Console"
              >
                <FiLogOut className="text-sm" />
                <span>Sign Out</span>
              </button>

              {/* Mobile Admin Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-300 hover:text-amber-400 text-2xl"
                aria-label="Toggle Admin Menu"
              >
                {mobileMenuOpen ? <FiX /> : <FiMenu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Admin Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#121216] border-b border-amber-500/30 px-6 pt-4 pb-6 space-y-3">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 border-b border-amber-500/20 pb-2">
              ⚡ Admin Operations Menu ({user?.role?.toUpperCase() || 'STAFF'})
            </div>

            {adminNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
                  isActive(link.path)
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-base text-amber-400">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            ))}

            <div className="pt-3 border-t border-amber-500/10 flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <FiGlobe className="text-amber-400" />
                <span>View Customer Storefront ↗</span>
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-center py-2.5 bg-red-500/20 text-red-400 border border-red-500/40 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <FiLogOut />
                <span>Sign Out of Console</span>
              </button>
            </div>
          </div>
        )}
      </header>
    );
  }

  // Standard Storefront Navbar
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

          {/* Right Action Controls: Theme -> Cart (Left) -> User Circle Avatar Dropdown (Right) */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* 1. Theme Light/Dark Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-[#181820] border border-amber-500/20 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400 transition"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
            </button>

            {/* 2. Wishlist Favorites Button */}
            <Link
              to="/favorites"
              className="relative p-2.5 rounded-xl bg-[#181820] border border-amber-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-400 transition flex items-center justify-center"
              title="View Favorite Delights"
            >
              <FaHeart className="text-lg text-red-500" />
              {totalFavoritesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border border-[#0d0d11] shadow-md">
                  {totalFavoritesCount}
                </span>
              )}
            </Link>

            {/* 2. Cart Trigger Button (POSITIONED ON THE LEFT OF USER CIRCLE) */}
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

            {/* 3. Circular User Avatar Dropdown (POSITIONED ON THE RIGHT OF CART) */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 focus:outline-none group"
                title="Account Settings"
              >
                <div className="w-10 h-10 rounded-full border-2 border-amber-500/40 group-hover:border-amber-400 overflow-hidden shadow-lg transition flex items-center justify-center bg-[#181820]">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : user ? (
                    <div className="w-full h-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-serif text-slate-950 font-black text-base">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  ) : (
                    <FiUser className="text-amber-400 text-lg" />
                  )}
                </div>
                <FiChevronDown className={`text-xs text-amber-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Card Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-14 w-64 bg-[#14141a] border border-amber-500/30 rounded-2xl p-4 shadow-2xl space-y-3 z-50 animate-fadeIn text-xs">
                  
                  {/* Dropdown Header */}
                  {user ? (
                    <div className="pb-3 border-b border-amber-500/10">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-white text-sm font-serif truncate">{user.name}</h4>
                        <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                          {user.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">{user.email}</p>
                    </div>
                  ) : (
                    <div className="pb-3 border-b border-amber-500/10">
                      <h4 className="font-bold text-white text-sm font-serif">Welcome Guest! 👋</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Sign in to track orders & earn rewards</p>
                    </div>
                  )}

                  {/* Dropdown Navigation Links */}
                  <div className="space-y-1">
                    {user ? (
                      <>
                        {(user.role === 'admin' || user.role === 'receptionist') && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 p-2 rounded-xl text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 font-bold transition"
                          >
                            <FiPieChart className="text-sm" />
                            <span>{user.role.toUpperCase()} Operations Portal</span>
                          </Link>
                        )}

                        <Link
                          to="/my-orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-xl text-gray-300 hover:text-amber-300 hover:bg-white/5 font-semibold transition"
                        >
                          <FiShoppingBag className="text-sm text-amber-400" />
                          <span>My Order History</span>
                        </Link>

                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-xl text-gray-300 hover:text-amber-300 hover:bg-white/5 font-semibold transition"
                        >
                          <FiUser className="text-sm text-amber-400" />
                          <span>Edit Profile Settings</span>
                        </Link>

                        <Link
                          to="/track-order"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-xl text-gray-300 hover:text-amber-300 hover:bg-white/5 font-semibold transition"
                        >
                          <FiPackage className="text-sm text-amber-400" />
                          <span>Live Order Tracker</span>
                        </Link>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2 p-2 rounded-xl text-red-400 hover:bg-red-500/10 font-bold transition text-left mt-2 border-t border-amber-500/10 pt-3"
                        >
                          <FiLogOut className="text-sm" />
                          <span>Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-xl text-slate-950 bg-amber-500 hover:bg-amber-400 font-bold transition justify-center"
                        >
                          <FiKey className="text-sm" />
                          <span>Sign In to Account</span>
                        </Link>

                        <Link
                          to="/register"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-xl text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 font-bold transition justify-center mt-1"
                        >
                          <FiUserPlus className="text-sm" />
                          <span>Create New Account</span>
                        </Link>

                        <Link
                          to="/track-order"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-xl text-gray-300 hover:text-amber-300 hover:bg-white/5 font-semibold transition mt-1"
                        >
                          <FiPackage className="text-sm text-amber-400" />
                          <span>Track Order as Guest</span>
                        </Link>
                      </>
                    )}
                  </div>

                </div>
              )}
            </div>

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
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-amber-300">
                  <span>Signed in: <strong>{user.name}</strong> ({user.role})</span>
                  <button onClick={logout} className="text-red-400 font-bold underline">Logout</button>
                </div>
                <div className="flex gap-2">
                  <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg font-bold">My Orders</Link>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2 bg-[#181820] text-gray-300 border border-gray-700/50 rounded-lg font-bold">Profile</Link>
                  <Link to="/track-order" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2 bg-[#181820] text-gray-300 border border-gray-700/50 rounded-lg font-bold">Track</Link>
                </div>
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

