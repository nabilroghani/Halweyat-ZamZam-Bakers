import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaLocationDot, FaPhone, FaClock } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="bg-[#2D1B12] text-[#FFF8F0] pt-16 pb-8 border-t border-[#C9982F]/20 relative overflow-hidden">
      {/* Decorative Golden Ambient Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C9982F]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Intro */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C9982F] flex items-center justify-center text-[#3D2418] font-bold text-xl">
                Z
              </div>
              <span className="font-heading text-2xl font-bold text-[#C9982F]">
                Halwiyat Zamzam
              </span>
            </div>
            <p className="text-sm text-cream/70 leading-relaxed">
              Crafting authentic Pakistani sweets, artisanal cakes, hot fast food, and fresh bakery items daily in Timergara, Dir Lower.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://www.facebook.com/share/19HXmd8dk3/?mibextid=wwXIfr"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/5 border border-[#C9982F]/30 flex items-center justify-center text-[#C9982F] hover:bg-[#C9982F] hover:text-[#3D2418] transition-all"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/5 border border-[#C9982F]/30 flex items-center justify-center text-[#C9982F] hover:bg-[#C9982F] hover:text-[#3D2418] transition-all"
              >
                <FaInstagram />
              </a>
              <a
                href="https://wa.me/923275001166"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-white/5 border border-[#C9982F]/30 flex items-center justify-center text-[#C9982F] hover:bg-[#C9982F] hover:text-[#3D2418] transition-all"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-[#C9982F] mb-4 border-b border-[#C9982F]/20 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-cream/80">
              <li><Link to="/" className="hover:text-[#C9982F] transition-colors">Home</Link></li>
              <li><Link to="/menu" className="hover:text-[#C9982F] transition-colors">Full Bakery Menu</Link></li>
              <li><Link to="/about" className="hover:text-[#C9982F] transition-colors">Our Brand Story</Link></li>
              <li><Link to="/gallery" className="hover:text-[#C9982F] transition-colors">Sweet Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-[#C9982F] transition-colors">Contact & Order</Link></li>
            </ul>
          </div>

          {/* Operating Hours & Categories */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-[#C9982F] mb-4 border-b border-[#C9982F]/20 pb-2">
              Baking Hours
            </h3>
            <ul className="space-y-3 text-sm text-cream/80">
              <li className="flex items-start gap-3">
                <FaClock className="text-[#C9982F] mt-1 shrink-0" />
                <div>
                  <span className="block font-semibold text-white">Monday - Sunday</span>
                  <span className="text-xs text-cream/60">07:00 AM - 11:00 PM</span>
                </div>
              </li>
              <li className="text-xs text-cream/60 pt-2 border-t border-white/5">
                Freshly baked breads & pastries ready by 7:30 AM every morning!
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-[#C9982F] mb-4 border-b border-[#C9982F]/20 pb-2">
              Visit Our Shop
            </h3>
            <ul className="space-y-3 text-sm text-cream/80">
              <li className="flex items-start gap-3">
                <FaLocationDot className="text-[#C9982F] mt-1 shrink-0" />
                <span>Main Bazaar, Timergara, Dir Lower, Khyber Pakhtunkhwa, Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-[#C9982F] shrink-0" />
                <span>+92 327 5001166</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-cream/60 gap-4">
          <p>© {new Date().getFullYear()} Halwiyat Zamzam Bakers. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Timergara, Dir Lower • Premium Bakery Pitch
          </p>
        </div>
      </div>
    </footer>
  );
}
