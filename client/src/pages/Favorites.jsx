import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useWishlistStore } from '../store/useWishlistStore';
import { FiHeart, FiShoppingBag, FiTrash2, FiArrowRight } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa6';

export default function Favorites() {
  const { favorites, clearFavorites, getTotalFavoritesCount } = useWishlistStore();
  const totalCount = getTotalFavoritesCount();

  return (
    <div className="min-h-screen bg-[#0d0d11] text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 flex items-center gap-1.5">
                <FaHeart className="text-red-500 text-xs" /> Customer Wishlist
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-serif gold-gradient-text">
              Your Favorite Delights
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              All your bookmarked sweets, artisanal cakes, and bakery favorites in one place.
            </p>
          </div>

          {totalCount > 0 && (
            <button
              onClick={clearFavorites}
              className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold transition flex items-center gap-2"
            >
              <FiTrash2 className="text-sm" /> Clear All Favorites
            </button>
          )}
        </div>

        {/* Favorites Content */}
        {totalCount === 0 ? (
          <div className="text-center py-20 bg-[#14141a] rounded-3xl border border-amber-500/10 p-8 space-y-5 max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-500 text-3xl">
              <FiHeart />
            </div>
            <h3 className="font-serif font-bold text-2xl text-amber-400">
              No Favorite Sweets Added Yet
            </h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
              Explore Timergara's finest mithai, artisanal cakes, and fresh bakery snacks. Click the heart icon on any item to save it here for quick ordering!
            </p>
            <div className="pt-2">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-amber-500/20 transition hover:scale-105"
              >
                <FiShoppingBag className="text-base" /> Explore Bakery Catalog <FiArrowRight />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-xs text-gray-400">
              Showing <strong className="text-amber-400">{totalCount}</strong> favorited items saved in your wishlist:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {favorites.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
