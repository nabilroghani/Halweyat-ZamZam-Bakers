import React from 'react';
import { FaWhatsapp } from 'react-icons/fa6';

export default function WhatsAppButton() {
  const phoneNumber = '923275001166';
  const defaultMessage = encodeURIComponent('Hello Halwiyat Zamzam Bakers! I would like to place an order.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order via WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-[#25D366] text-white px-3.5 py-3 rounded-full shadow-2xl hover:bg-[#20bd5a] transition-all duration-300 transform hover:scale-105 active:scale-95 group border border-white/20"
    >
      <div className="relative flex items-center justify-center">
        <FaWhatsapp className="text-2xl" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
      </div>
      <span className="font-semibold text-xs sm:text-sm tracking-wide">
        Order on WhatsApp
      </span>
    </a>
  );
}
