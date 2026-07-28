import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaCertificate, FaUtensils, FaFaceSmile } from 'react-icons/fa6';

export default function About() {
  const stats = [
    { label: 'Happy Customers Served', value: '50,000+' },
    { label: 'Fresh Products Baked Daily', value: '1,500+' },
    { label: 'Unique Sweet Recipes', value: '40+' },
    { label: 'Years of Baking Passion', value: '15+' },
  ];

  const galleryStrip = [
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
  ];

  return (
    <div className="pt-28 pb-24 bg-[#FFF8F0]">
      {/* Hero Section */}
      <section className="relative py-20 bg-[#3D2418] text-[#FFF8F0] overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4 relative z-10">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9982F]">
            Timergara Dir Lower, Pakistan
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-[#FFF8F0]">
            The Heritage of Halwiyat Zamzam
          </h1>
          <p className="text-sm sm:text-lg text-cream/80 max-w-2xl mx-auto font-sans font-light leading-relaxed">
            Where traditional Pashtun hospitality meets world-class confectionery and modern bakery artistry.
          </p>
        </div>
      </section>

      {/* Main Story & Vision */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7B1E3A]">
              Our Journey
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#3D2418]">
              A Story Baked with Love, Passion & Pure Desi Ghee
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed font-sans">
              Founded in Timergara, Dir Lower, <strong>Halwiyat Zamzam Bakers</strong> started with a simple promise: to serve the freshest, purest, and most delicious sweets and bakery items to families across Khyber Pakhtunkhwa.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed font-sans">
              From our famous saffron-soaked Gulab Jamuns and creamy Rasmalai to our custom tiered wedding cakes, every product is crafted by experienced master bakers who take immense pride in their work.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white border border-[#C9982F]/20 shadow-sm space-y-1">
                <FaCertificate className="text-2xl text-[#C9982F]" />
                <h4 className="font-heading font-bold text-sm text-[#3D2418]">100% Quality Assurance</h4>
                <p className="text-[11px] text-stone-500">Only organic milk, pure khoya & premium nuts.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#C9982F]/20 shadow-sm space-y-1">
                <FaHeart className="text-2xl text-[#7B1E3A]" />
                <h4 className="font-heading font-bold text-sm text-[#3D2418]">Handmade Daily</h4>
                <p className="text-[11px] text-stone-500">Zero artificial preservers or stale batches.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-[#C9982F]/30 h-[450px]">
              <img
                src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1000&q=80"
                alt="Bakery Kitchen"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 glass-panel p-6 rounded-2xl shadow-xl max-w-xs border border-[#C9982F]/40 hidden sm:block">
              <span className="text-3xl font-heading font-bold text-[#7B1E3A] block">100%</span>
              <span className="text-xs font-semibold text-[#3D2418] uppercase tracking-wider">Hygienic & Fresh Certified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Banner */}
      <section className="py-16 bg-[#3D2418] text-[#FFF8F0]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-2">
              <span className="font-heading text-3xl sm:text-5xl font-extrabold text-[#C9982F] block">
                {stat.value}
              </span>
              <span className="text-xs uppercase tracking-wider text-cream/70 font-sans">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Strip */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7B1E3A]">
            Kitchen Snapshots
          </span>
          <h2 className="font-heading text-3xl font-bold text-[#3D2418]">
            Fresh Out Of The Oven
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryStrip.map((img, idx) => (
            <div key={idx} className="h-56 rounded-2xl overflow-hidden shadow-md group">
              <img
                src={img}
                alt="Gallery preview"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
