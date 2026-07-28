import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { FaStore } from 'react-icons/fa';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About Us', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const isHome = location.pathname === '/';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#3D2418]/95 backdrop-blur-md shadow-lg py-3 text-[#FFF8F0]'
          : isHome
          ? 'bg-gradient-to-b from-black/70 via-black/30 to-transparent py-5 text-white'
          : 'bg-[#3D2418] py-4 text-[#FFF8F0]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#C9982F] flex items-center justify-center text-[#3D2418] font-bold text-xl shadow-md group-hover:scale-105 transition-transform duration-300">
            Z
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-xl sm:text-2xl tracking-wide text-[#C9982F] leading-none">
              Halwiyat Zamzam
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-cream/80 font-sans mt-0.5">
              Bakers • Timergara
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative py-1 text-sm font-medium tracking-wide transition-colors duration-300 ${
                  isActive ? 'text-[#C9982F]' : 'hover:text-[#C9982F]'
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9982F] rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          <Link
            to="/menu"
            className="px-5 py-2 rounded-full bg-[#7B1E3A] hover:bg-[#9B2A4A] text-white text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
          >
            Explore Menu
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-2xl focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#3D2418] border-t border-[#C9982F]/20 text-[#FFF8F0]"
          >
            <div className="px-6 py-6 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-lg font-medium py-2 border-b border-white/5 transition-colors ${
                    location.pathname === link.path ? 'text-[#C9982F] font-bold' : 'text-cream/90'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/menu"
                className="mt-2 text-center py-3 bg-[#7B1E3A] text-white rounded-xl font-semibold uppercase text-xs tracking-widest"
              >
                Explore Menu
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
