import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';

export default function FilterBar({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange
}) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar scroll-smooth">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`relative px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 shrink-0 ${
                isActive
                  ? 'text-white'
                  : 'text-[#3D2418] hover:text-[#7B1E3A] bg-white/60 hover:bg-white border border-[#C9982F]/20'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryBg"
                  className="absolute inset-0 bg-[#7B1E3A] rounded-full shadow-md"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative w-full md:w-72">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-base" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search cakes, sweets, samosa..."
          className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-[#C9982F]/30 text-xs text-[#3D2418] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C9982F] shadow-sm transition-all"
        />
      </div>
    </div>
  );
}
