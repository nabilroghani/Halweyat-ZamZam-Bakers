import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductService } from '../services/api';
import { useCartStore } from '../store/useCartStore';
import { motion } from 'framer-motion';
import { FaUtensils, FaRibbon, FaAward, FaSeedling, FaArrowRight, FaStar, FaWhatsapp, FaCakeCandles } from 'react-icons/fa6';
import { FiShoppingBag } from 'react-icons/fi';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await ProductService.getAll({ featured: 'true' });
        setFeaturedProducts(data || []);
      } catch (err) {
        console.error('Error loading featured items:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  const features = [
    {
      icon: <FaSeedling className="text-3xl text-amber-400" />,
      title: 'Fresh Daily',
      desc: 'Every pastry, cake, and traditional sweet is baked fresh every morning in Timergara.'
    },
    {
      icon: <FaAward className="text-3xl text-amber-400" />,
      title: 'Pure Desi Ghee',
      desc: 'We use authentic khoya, pure desi ghee, organic dry fruits, and zero artificial preservatives.'
    },
    {
      icon: <FaRibbon className="text-3xl text-amber-400" />,
      title: '10+ Years Heritage',
      desc: 'Timergara’s trusted sweet bakery serving weddings, birthdays, and family celebrations.'
    },
    {
      icon: <FaUtensils className="text-3xl text-amber-400" />,
      title: 'Custom Cake Studio',
      desc: 'Personalized multi-tier birthday & wedding cakes designed to your exact flavor & theme.'
    }
  ];

  return (
    <div className="overflow-hidden bg-[#0d0d11] text-gray-100">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-4">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1920&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d11] via-[#0d0d11]/80 to-black/70" />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto space-y-6">
          <span className="inline-block px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-[0.25em] backdrop-blur-md">
            ✨ Timergara’s Premium Sweets & Bakers
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-serif text-white tracking-tight leading-none">
            Taste the Traditions of <br />
            <span className="gold-gradient-text">
              Pure Sweet Excellence
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-gray-300 font-sans font-medium leading-relaxed bg-[#14141a]/80 backdrop-blur-md px-6 py-4 rounded-2xl max-w-2xl mx-auto border border-amber-500/20 shadow-2xl">
            Artisanal cakes, traditional Pakistani mithai, hot fast food snacks, and morning fresh bakery delights prepared daily in Timergara, Dir Lower.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/menu"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold uppercase tracking-widest transition-all duration-300 shadow-xl shadow-amber-500/20 hover:scale-105 flex items-center justify-center gap-2"
            >
              <FiShoppingBag className="text-base" /> Explore Bakery Menu
            </Link>

            <Link
              to="/custom-cake"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#181820] hover:bg-[#20202a] text-amber-300 border border-amber-500/40 text-xs font-extrabold uppercase tracking-widest transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <FaCakeCandles className="text-base" /> Custom Cake Studio
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SIGNATURE PRODUCTS SHOWCASE */}
      <section className="py-24 bg-[#121216] relative border-t border-amber-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              Handcrafted Specialties
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif gold-gradient-text">
              Our Signature Delights
            </h2>
            <p className="text-sm text-gray-400">
              Customer favorites crafted with authentic recipes and pure desi ingredients.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading sweets menu...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.slice(0, 6).map((item) => (
                <div
                  key={item._id}
                  className="bg-[#181820] rounded-3xl overflow-hidden shadow-2xl border border-amber-500/20 flex flex-col group hover:border-amber-500/40 transition-all duration-500"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-[10px] uppercase font-black px-3 py-1 rounded-full shadow-md">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-serif font-bold text-xl text-white mb-2 group-hover:text-amber-400 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-sans line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-amber-500/10">
                      <div>
                        <span className="text-xl font-bold font-mono text-amber-400">
                          Rs. {item.price}
                        </span>
                        <span className="text-[10px] text-gray-500 block">per {item.unit || 'Kg'}</span>
                      </div>

                      <button
                        onClick={() => addToCart(item)}
                        className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <FiShoppingBag /> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link 
              to="/menu"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 hover:underline"
            >
              View Entire Menu Catalog &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE US */}
      <section className="py-24 bg-[#0d0d11] border-t border-amber-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              The Zamzam Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif gold-gradient-text">
              Why Timergara Chooses Us
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-[#14141a] p-8 rounded-3xl shadow-xl border border-amber-500/20 text-center space-y-4 flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  {feat.icon}
                </div>
                <h3 className="font-serif font-bold text-lg text-white">
                  {feat.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION BANNER */}
      <section className="py-20 bg-gradient-to-r from-[#181820] via-[#121216] to-[#0d0d11] text-white border-t border-amber-500/20 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold font-serif gold-gradient-text">
            Order Sweets & Custom Cakes Direct
          </h2>
          <p className="text-sm text-gray-300 max-w-2xl mx-auto">
            Place your order online or send us a WhatsApp message for instant counter fulfillment in Timergara.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/menu"
              className="px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-widest shadow-xl shadow-amber-500/20"
            >
              Order Online Now
            </Link>
            <a
              href="https://wa.me/923459000123"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/30 flex items-center justify-center gap-2"
            >
              <FaWhatsapp className="text-base" /> WhatsApp Order
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
