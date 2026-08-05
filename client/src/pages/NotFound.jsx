import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiShoppingBag, FiAlertTriangle } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-[#0d0d11] text-white flex items-center justify-center py-16 px-4">
      <div className="max-w-lg w-full bg-[#14141a] border border-amber-500/20 rounded-3xl p-8 sm:p-12 shadow-2xl text-center relative overflow-hidden">
        {/* Ambient Golden Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/30 rounded-2xl mx-auto flex items-center justify-center text-amber-400 text-4xl mb-6 shadow-inner">
          <FiAlertTriangle />
        </div>

        <span className="text-amber-400 font-extrabold text-6xl tracking-wider font-serif block mb-2">
          404
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold font-serif gold-gradient-text mb-3">
          Page Not Found
        </h1>

        <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto leading-relaxed mb-8">
          Oops! The page you are looking for does not exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition"
          >
            <FiHome className="text-base" />
            <span>Return to Home</span>
          </Link>

          <Link
            to="/menu"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#181820] hover:bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold text-xs rounded-xl transition"
          >
            <FiShoppingBag className="text-base" />
            <span>Explore Menu</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
