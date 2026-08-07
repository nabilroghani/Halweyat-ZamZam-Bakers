import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import { ProductService } from '../services/api';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';
import { getSocket } from '../store/useSocket';

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All', 
    'Sweets', 
    'Cakes', 
    'Custom Cakes', 
    'Bakery Items', 
    'Fast Food', 
    'Nimko & Snacks', 
    'Deals'
  ];

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await ProductService.getAll({ category: activeCategory });
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🔌 Socket.IO Real-Time: Live product & stock updates for customers
  useEffect(() => {
    const socket = getSocket();

    const handleStockUpdated = (data) => {
      setProducts(prev => prev.map(p => p._id === data._id ? { ...p, isAvailable: data.isAvailable } : p));
    };

    const handleProductAdded = (newProduct) => {
      // Only add if category matches or we're on 'All'
      if (activeCategory === 'All' || newProduct.category === activeCategory) {
        setProducts(prev => [newProduct, ...prev.filter(p => p._id !== newProduct._id)]);
      }
    };

    const handleProductUpdated = (updatedProduct) => {
      setProducts(prev => prev.map(p => p._id === updatedProduct._id ? updatedProduct : p));
    };

    const handleProductDeleted = (data) => {
      setProducts(prev => prev.filter(p => p._id !== data._id));
    };

    socket.on('product-stock-updated', handleStockUpdated);
    socket.on('product-added', handleProductAdded);
    socket.on('product-updated', handleProductUpdated);
    socket.on('product-deleted', handleProductDeleted);

    return () => {
      socket.off('product-stock-updated', handleStockUpdated);
      socket.off('product-added', handleProductAdded);
      socket.off('product-updated', handleProductUpdated);
      socket.off('product-deleted', handleProductDeleted);
    };
  }, [activeCategory]);

  const displayedProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0d0d11] text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto text-center space-y-4 mb-12">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
          Timergara Sweet & Bakery Menu
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-serif gold-gradient-text">
          Artisanal Bakery & Sweets Catalog
        </h1>
        <p className="text-sm text-gray-400 max-w-xl mx-auto">
          Explore our range of traditional sweets, custom cakes, fast food snacks, and morning pastries. Order online or via WhatsApp!
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Category Pills Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar justify-start md:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-[#14141a] text-gray-400 border border-amber-500/10 hover:border-amber-500/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar & Result Count */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#14141a] border border-amber-500/20 p-4 rounded-2xl">
          <div className="text-xs text-gray-400">
            Showing <strong className="text-amber-400">{displayedProducts.length}</strong> items in{' '}
            <strong className="text-white">{activeCategory}</strong>
          </div>

          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-3.5 top-3.5 text-gray-500 text-sm" />
            <input 
              type="text"
              placeholder="Search sweets, cakes, nimko..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#181820] border border-amber-500/20 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 flex items-center justify-center gap-2">
            <FiRefreshCw className="animate-spin text-amber-400" /> Loading menu catalog...
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#14141a] rounded-3xl border border-amber-500/10 p-8 space-y-4">
            <span className="text-4xl">🧁</span>
            <h3 className="font-serif font-bold text-xl text-amber-400">No items found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              No products matched "{searchQuery}". Try selecting another category or resetting filters.
            </p>
            <button
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="px-5 py-2.5 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold uppercase"
            >
              Reset Search & Category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
