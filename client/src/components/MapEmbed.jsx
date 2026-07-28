import React from 'react';

export default function MapEmbed() {
  // Timergara, Dir Lower coordinates ~ 34.8374, 71.8467
  const mapSrc = "https://maps.google.com/maps?q=Timergara,%20Dir%20Lower,%20Khyber%20Pakhtunkhwa,%20Pakistan&t=&z=14&ie=UTF8&iwloc=&output=embed";

  return (
    <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#C9982F]/30 bg-stone-100">
      <iframe
        title="Halwiyat Zamzam Bakers Location"
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full filter contrast-105"
      ></iframe>
      
      {/* Overlay Badge */}
      <div className="absolute top-4 left-4 glass-panel px-4 py-3 rounded-2xl shadow-lg border border-[#C9982F]/40 flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
        <div>
          <h4 className="font-heading font-bold text-xs text-[#3D2418]">Halwiyat Zamzam Bakers</h4>
          <p className="text-[10px] text-stone-600">Timergara Dir Lower • Open Today</p>
        </div>
      </div>
    </div>
  );
}
