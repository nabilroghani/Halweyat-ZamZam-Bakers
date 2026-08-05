import React from 'react';
import { FaHeart, FaCertificate, FaUtensils, FaAward } from 'react-icons/fa6';

export default function About() {
  const stats = [
    { label: 'Happy Customers Served', value: '50,000+' },
    { label: 'Fresh Sweets & Pastries Daily', value: '1,500+' },
    { label: 'Unique Sweet Recipes', value: '50+' },
    { label: 'Years of Sweet Passion', value: '10+' },
  ];

  const galleryStrip = [
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600',
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600',
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600',
    'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600',
  ];

  return (
    <div className="min-h-screen bg-[#0d0d11] text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="max-w-5xl mx-auto text-center space-y-4 mb-16">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
          Timergara Dir Lower, Pakistan
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-serif gold-gradient-text">
          The Heritage of Halwiyat Zamzam
        </h1>
        <p className="text-sm sm:text-lg text-gray-300 max-w-2xl mx-auto font-sans leading-relaxed">
          Where traditional Pashtun hospitality meets world-class confectionery and modern bakery artistry.
        </p>
      </div>

      {/* Main Story & Vision */}
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Our Sweet Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white">
              Baked with Passion, Crafted with Pure Desi Ghee
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Founded in Timergara, Dir Lower, <strong className="text-amber-400">Halwiyat Zamzam Bakers</strong> started with a simple promise: to serve the freshest, purest, and most delicious sweets and bakery delights across Khyber Pakhtunkhwa.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              From our signature Zafrani Rasmalai and saffron-infused Gulab Jamuns to custom multi-tier birthday and wedding cakes, every product is prepared by master pastry chefs.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-[#14141a] border border-amber-500/20 space-y-1">
                <FaCertificate className="text-2xl text-amber-400" />
                <h4 className="font-serif font-bold text-sm text-white">100% Pure Guarantee</h4>
                <p className="text-[11px] text-gray-400">Pure khoya, organic milk & real desi ghee.</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#14141a] border border-amber-500/20 space-y-1">
                <FaHeart className="text-2xl text-rose-400" />
                <h4 className="font-serif font-bold text-sm text-white">Handmade Daily</h4>
                <p className="text-[11px] text-gray-400">Prepared fresh every morning in Timergara.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30 h-[420px]">
              <img
                src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1000"
                alt="Bakery Kitchen"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Stats Counter Banner */}
        <div className="bg-[#14141a] border border-amber-500/20 rounded-3xl p-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <span className="font-serif text-3xl sm:text-5xl font-extrabold gold-gradient-text block">
                {stat.value}
              </span>
              <span className="text-xs uppercase tracking-wider text-gray-400">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Gallery Strip */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Kitchen Snapshots
            </span>
            <h2 className="text-3xl font-bold font-serif text-white">
              Fresh Out Of The Oven
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryStrip.map((img, idx) => (
              <div key={idx} className="h-56 rounded-2xl overflow-hidden shadow-lg border border-amber-500/20 group">
                <img
                  src={img}
                  alt="Gallery preview"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
