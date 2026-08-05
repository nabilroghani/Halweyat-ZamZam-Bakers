import React from 'react';
import { FaWhatsapp } from 'react-icons/fa6';

export default function WhatsAppButton() {
  const phoneNumber = '923459000123';
  const defaultMessage = encodeURIComponent('Hello Halwiyat Zamzam Bakers! I would like to place an order from Timergara.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold p-3.5 rounded-full shadow-2xl transition-all duration-300 group border border-emerald-400/40 shadow-emerald-900/40 overflow-hidden max-w-[54px] hover:max-w-[320px] hover:px-5"
    >
      <div className="relative flex items-center justify-center shrink-0">
        <FaWhatsapp className="text-2xl text-slate-950" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
      </div>

      <span className="text-xs font-extrabold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-3">
        Order on WhatsApp (+92 345 9000123)
      </span>
    </a>
  );
}
