import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import Loader from '../components/Loader';
import { sampleProducts } from '../../../server/data/seedData.js'; // Fallback seed data if API offline

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Cakes', 'Sweets', 'Fast Food', 'Bakery Items', 'Drinks'];

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/api/products';
      if (activeCategory !== 'All') {
        url += `?category=${encodeURIComponent(activeCategory)}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          throw new Error('API returned empty array');
        }
      } else {
        throw new Error('API returned error');
      }
    } catch (err) {
      console.warn('Using client-side fallback products:', err.message);
      let filtered = [...sampleProducts];
      if (activeCategory !== 'All') {
        filtered = filtered.filter(
          p => p.category.toLowerCase() === activeCategory.toLowerCase()
        );
      }
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  };

  // Client-side search filtering
  const displayedProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#FFF8F0]">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-[#3D2418] to-[#5C3A2E] text-white py-16 px-4 mb-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C9982F_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9982F]">
            Freshly Baked Every Morning
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-[#FFF8F0]">
            Our Bakery & Sweets Menu
          </h1>
          <p className="text-sm sm:text-base text-cream/80 max-w-xl mx-auto font-sans font-light">
            Select a category below to explore our signature cakes, warm sweets, hot fast food, and refreshing drinks.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter Bar & Search */}
        <FilterBar
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Category Description Tagline */}
        <div className="flex items-center justify-between border-b border-[#C9982F]/20 pb-4 mb-8 text-xs text-stone-500">
          <span>
            Showing <strong className="text-[#3D2418]">{displayedProducts.length}</strong> items in{' '}
            <strong className="text-[#7B1E3A]">{activeCategory}</strong>
          </span>
          <span>Order via WhatsApp button on any item</span>
        </div>

        {/* Product Grid */}
        {loading ? (
          <Loader />
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
            <span className="text-4xl">🧁</span>
            <h3 className="font-heading font-bold text-xl text-[#3D2418]">No products found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              We couldn't find any items matching "{searchQuery}". Try selecting another category or clearing your search.
            </p>
            <button
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="px-5 py-2.5 bg-[#7B1E3A] text-white rounded-full text-xs font-bold uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {displayedProducts.map((product, idx) => (
                <ProductCard key={product._id || product.name || idx} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
