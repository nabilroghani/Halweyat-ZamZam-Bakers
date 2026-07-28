import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaWhatsapp } from 'react-icons/fa6';

export default function ProductCard({ product }) {
  const whatsappMsg = encodeURIComponent(
    `Hello Halwiyat Zamzam Bakers! I would like to order "${product.name}" (PKR ${product.price}/${product.unit}).`
  );
  const whatsappUrl = `https://wa.me/923275001166?text=${whatsappMsg}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl overflow-hidden border border-[#C9982F]/20 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group"
    >
      {/* Product Image Container */}
      <div className="relative h-56 overflow-hidden bg-cream-dark">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-[#3D2418]/80 backdrop-blur-md text-[#C9982F] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border border-[#C9982F]/30">
          {product.category}
        </span>

        {/* Featured Tag */}
        {product.featured && (
          <span className="absolute top-3 right-3 bg-[#7B1E3A] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow">
            ★ Chef Special
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-heading font-bold text-lg text-[#3D2418] group-hover:text-[#7B1E3A] transition-colors line-clamp-1">
              {product.name}
            </h3>
            {/* Rating */}
            <div className="flex items-center gap-1 text-xs bg-[#FFF8F0] px-2 py-0.5 rounded-full border border-[#C9982F]/30 shrink-0">
              <FaStar className="text-[#C9982F]" />
              <span className="font-bold text-[#3D2418]">{product.rating}</span>
            </div>
          </div>
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 block font-medium">Price</span>
            <div className="flex items-baseline gap-1">
              <span className="font-heading font-bold text-xl text-[#7B1E3A]">
                Rs. {product.price.toLocaleString()}
              </span>
              <span className="text-[11px] text-stone-500 font-sans">/{product.unit}</span>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1eb957] text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow transition-all duration-300 hover:scale-105 active:scale-95"
            title="Order directly on WhatsApp"
          >
            <FaWhatsapp className="text-base" />
            <span>Order</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
