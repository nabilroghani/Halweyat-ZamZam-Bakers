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
  const [addedItemIds, setAddedItemIds] = useState({});
  const addToCart = useCartStore((state) => state.addToCart);

  const handleHomeAddToCart = (item) => {
    addToCart(item);
    setAddedItemIds((prev) => ({ ...prev, [item._id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item._id]: false }));
    }, 1500);
  };

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
                        <span className="text-[10px] text-gray-500 block">per {item.unit || 'Piece'}</span>
                      </div>

                      <button
                        onClick={() => handleHomeAddToCart(item)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          addedItemIds[item._id]
                            ? 'bg-emerald-500 text-slate-950 border border-emerald-400'
                            : 'bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/30'
                        }`}
                      >
                        <FiShoppingBag /> {addedItemIds[item._id] ? 'Added!' : 'Add to Cart'}
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

      {/* 5. CUSTOMER TESTIMONIALS */}
      <section className="py-24 bg-[#121216] border-t border-amber-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              What Our Customers Say
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif gold-gradient-text">
              Loved by Timergara Families
            </h2>
            <p className="text-sm text-gray-400">
              Real words from our happy customers across Dir Lower and KP.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Hamid Khan',
                area: 'Timergara, Dir Lower',
                rating: 5,
                review: 'Best Gulab Jamun in all of Dir! Pure khoya, perfect sweetness, and the saffron syrup is absolutely divine. We order every week for family gatherings.',
                initials: 'HK',
                color: 'bg-amber-500/20 text-amber-400'
              },
              {
                name: 'Sara Begum',
                area: 'Peshawar',
                rating: 5,
                review: 'Ordered a 5 Lbs custom birthday cake for my son. The chocolate fudge layering and personalized message were exactly as we requested. Absolutely stunning!',
                initials: 'SB',
                color: 'bg-rose-500/20 text-rose-400'
              },
              {
                name: 'Niamatullah Shah',
                area: 'Dir Upper',
                rating: 5,
                review: 'Bought Zafrani Rasmalai and traditional mithai for Eid. The quality is unmatchable — tastes exactly like home-made desi ghee mithai. Highly recommended!',
                initials: 'NS',
                color: 'bg-emerald-500/20 text-emerald-400'
              },
              {
                name: 'Asad Rehman',
                area: 'Munda, Dir Lower',
                rating: 5,
                review: 'The crispy chicken patties and fresh donuts are out of this world! My kids absolutely love them. The counter service is quick and the staff is very courteous.',
                initials: 'AR',
                color: 'bg-blue-500/20 text-blue-400'
              },
              {
                name: 'Razia Gul',
                area: 'Timergara',
                rating: 5,
                review: 'Used the online ordering system for the first time — it was very easy! Order arrived on time and the packaging was excellent. Will order again.',
                initials: 'RG',
                color: 'bg-purple-500/20 text-purple-400'
              },
              {
                name: 'Bismillah Jan',
                area: 'Wari, Upper Dir',
                rating: 5,
                review: 'Made a special WhatsApp order for a wedding reception. Over 300 guests — and not a single complaint! Zamzam Bakers delivered pure, fresh mithai in bulk.',
                initials: 'BJ',
                color: 'bg-amber-500/20 text-amber-400'
              }
            ].map((review, idx) => (
              <div
                key={idx}
                className="bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 space-y-4 hover:border-amber-500/40 transition-all duration-300 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full ${review.color} flex items-center justify-center font-bold text-sm border border-current/30`}>
                    {review.initials}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{review.name}</div>
                    <div className="text-[11px] text-gray-500">{review.area}</div>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array(review.rating).fill(null).map((_, i) => (
                      <FaStar key={i} className="text-amber-400 text-xs" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed italic">
                  "{review.review}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BUSINESS HOURS & LOCATION */}
      <section className="py-20 bg-[#0d0d11] border-t border-amber-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Visit Us</span>
                <h2 className="text-3xl sm:text-4xl font-bold font-serif gold-gradient-text mt-2">
                  Find Us in Timergara
                </h2>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  Come visit our main bakery counter in the heart of Timergara. Fresh sweets and bakery items are ready from 7 AM every morning!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#14141a] border border-amber-500/20 rounded-2xl p-5 space-y-2">
                  <div className="text-amber-400 text-xl">📍</div>
                  <h4 className="font-bold text-white text-sm">Main Branch</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">Main Bazaar, Timergara, Dir Lower, Khyber Pakhtunkhwa, Pakistan</p>
                </div>
                <div className="bg-[#14141a] border border-amber-500/20 rounded-2xl p-5 space-y-2">
                  <div className="text-amber-400 text-xl">📞</div>
                  <h4 className="font-bold text-white text-sm">Call / WhatsApp</h4>
                  <p className="text-xs text-gray-400">+92 327 5001166</p>
                  <p className="text-xs text-gray-400">+92 345 9000123</p>
                </div>
                <div className="bg-[#14141a] border border-amber-500/20 rounded-2xl p-5 space-y-2">
                  <div className="text-amber-400 text-xl">🕐</div>
                  <h4 className="font-bold text-white text-sm">Opening Hours</h4>
                  <p className="text-xs text-gray-400">Mon – Sun: 7:00 AM – 11:00 PM</p>
                  <p className="text-[11px] text-emerald-400 font-semibold">Fresh baking from 7:30 AM daily</p>
                </div>
                <div className="bg-[#14141a] border border-amber-500/20 rounded-2xl p-5 space-y-2">
                  <div className="text-amber-400 text-xl">🚗</div>
                  <h4 className="font-bold text-white text-sm">Delivery Zone</h4>
                  <p className="text-xs text-gray-400">Timergara City & nearby areas. Rs. 150 delivery fee.</p>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Timergara+Dir+Lower+Pakistan"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition"
              >
                📍 View on Google Maps →
              </a>
            </div>

            <div className="rounded-3xl overflow-hidden border border-amber-500/20 shadow-2xl h-80 bg-[#14141a] flex items-center justify-center">
              <iframe
                title="Halwiyat Zamzam Bakers Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26453.067413574896!2d71.82893165!3d34.83386185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dbc5e3e6d3b4f5%3A0x2b89b8d5b3e00d4b!2sTimergara%2C+Khyber+Pakhtunkhwa%2C+Pakistan!5e0!3m2!1sen!2s!4v1706000000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
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
              href="https://wa.me/923275001166"
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
