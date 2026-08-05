import React, { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { FiShoppingBag, FiCheck, FiStar } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  
  const weightOpts = product.weightOptions && product.weightOptions.length > 0
    ? product.weightOptions
    : [product.unit ? `1 ${product.unit}` : 'Standard'];

  const [selectedOption, setSelectedOption] = useState(weightOpts[0]);
  const [added, setAdded] = useState(false);

  const getOptionLabel = () => {
    const cat = product.category || '';
    if (cat.includes('Cakes')) return 'Select Weight (Pounds / Size)';
    if (cat === 'Fast Food') return 'Select Portion / Size';
    if (cat === 'Sweets' || cat === 'Nimko & Snacks') return 'Select Weight / Quantity';
    return 'Select Size / Portion';
  };

  const handleAddToCart = () => {
    addToCart(product, 1, selectedOption);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWhatsAppSingleItem = () => {
    const text = `Hi Halwiyat Zamzam Bakers! I would like to order: *${product.name}* (${selectedOption}) - Rs. ${product.price}. Please confirm availability!`;
    window.open(`https://wa.me/923459000123?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-[#181820] border border-amber-500/20 rounded-3xl overflow-hidden flex flex-col group hover:border-amber-500/40 transition-all duration-300 shadow-xl hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Category Pill */}
        <span className="absolute top-3 left-3 bg-[#121216]/80 backdrop-blur-md text-amber-400 border border-amber-500/30 text-[10px] uppercase font-bold px-3 py-1 rounded-full">
          {product.category}
        </span>

        {/* Availability Badge */}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-red-600 text-white font-extrabold text-xs uppercase px-4 py-1.5 rounded-full shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-serif font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
              <FiStar className="fill-amber-400" />
              <span>{product.rating || 4.9}</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-400 leading-relaxed font-sans line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Portion / Size Option Selector */}
        {product.weightOptions && product.weightOptions.length > 0 && (
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">{getOptionLabel()}</label>
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#121216] border border-amber-500/20 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
            >
              {weightOpts.map((opt, idx) => (
                <option key={idx} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-amber-500/10 space-y-3">
          <div className="flex justify-between items-baseline">
            <div>
              <span className="text-lg font-bold font-mono text-amber-400">Rs. {product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-gray-500 line-through ml-2">Rs. {product.originalPrice}</span>
              )}
            </div>
            <span className="text-[10px] text-gray-400 font-medium">per {product.unit || 'Piece'}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={!product.isAvailable}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                added 
                  ? 'bg-emerald-500 text-slate-950' 
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 disabled:opacity-40'
              }`}
            >
              {added ? <FiCheck /> : <FiShoppingBag />}
              {added ? 'Added!' : 'Add to Cart'}
            </button>

            <button
              onClick={handleWhatsAppSingleItem}
              className="py-2 px-3 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
              title="Instant WhatsApp Order"
            >
              <FaWhatsapp className="text-sm" /> Order
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
