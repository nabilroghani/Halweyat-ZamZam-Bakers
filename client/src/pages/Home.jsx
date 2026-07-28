import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';
import { FaUtensils, FaRibbon, FaAward, FaSeedling, FaArrowRight, FaStar } from 'react-icons/fa6';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const heroBgRef = useRef(null);
  const heroTextRef = useRef(null);
  const signatureSecRef = useRef(null);
  const storySecRef = useRef(null);

  useGSAP(() => {
    // 1. Hero Parallax & Zoom on scroll
    gsap.to(heroBgRef.current, {
      scale: 1.15,
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    // 2. Hero Text Fade Out on Scroll
    gsap.to(heroTextRef.current, {
      opacity: 0,
      y: -60,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: '70% top',
        scrub: true,
      },
    });

    // 3. Signature Products Slide & Scale Pin Animation
    const signatureCards = gsap.utils.toArray('.sig-card');
    signatureCards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 100, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // 4. Background Color Shift for Brand Story Teaser
    gsap.to(storySecRef.current, {
      backgroundColor: '#3D2418',
      color: '#FFF8F0',
      scrollTrigger: {
        trigger: storySecRef.current,
        start: 'top 75%',
        end: 'bottom bottom',
        toggleActions: 'play none none reverse',
      },
    });
  }, { scope: containerRef });

  const signatureItems = [
    {
      title: 'Royal Black Forest Cake',
      desc: 'Layered with fresh whipped cream, dark cocoa sponge, and whole sweet cherries.',
      price: 'Rs. 1,800',
      tag: 'Cakes',
      img: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Special Shahi Gulab Jamun',
      desc: 'Fried khoya dumplings soaked in warm saffron & cardamom syrup.',
      price: 'Rs. 950 / kg',
      tag: 'Sweets',
      img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Chicken Patties & Fast Food',
      desc: 'Golden flaky puff pastry with spiced shredded chicken filling.',
      price: 'Rs. 120 / pc',
      tag: 'Fast Food',
      img: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const features = [
    {
      icon: <FaSeedling className="text-3xl text-[#C9982F]" />,
      title: 'Fresh Daily',
      desc: 'Every pastry, loaf of bread, and sweet is prepared fresh every morning in Timergara.',
    },
    {
      icon: <FaAward className="text-3xl text-[#C9982F]" />,
      title: 'Pure Desi Ingredients',
      desc: 'We use premium khoya, pure ghee, nuts, and authentic spices with zero artificial preservatives.',
    },
    {
      icon: <FaRibbon className="text-3xl text-[#C9982F]" />,
      title: 'Trusted Quality',
      desc: 'Serving families and grand celebrations across Dir Lower with unmatched sweet perfection.',
    },
    {
      icon: <FaUtensils className="text-3xl text-[#C9982F]" />,
      title: '5 Categories',
      desc: 'From custom wedding cakes to hot samosas and fresh juices, we cater to every craving.',
    },
  ];

  return (
    <div ref={containerRef} className="overflow-hidden">
      {/* 1. CINEMATIC HERO SECTION */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image with GSAP Parallax */}
        <div
          ref={heroBgRef}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1920&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#3D2418] via-black/50 to-black/70" />
        </div>

        {/* Hero Content */}
        <div
          ref={heroTextRef}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-6 pt-16"
        >
          {/* Calligraphy / Urdu Subtitle */}
          <span className="inline-block px-5 py-1.5 rounded-full bg-[#C9982F]/20 border border-[#C9982F]/40 text-[#C9982F] text-xs font-semibold uppercase tracking-[0.25em] backdrop-blur-md">
            حلویات زمزم بیکرز • Timergara Dir Lower
          </span>

          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-none drop-shadow-md">
            Taste the Traditions of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9982F] via-[#E0B653] to-[#FFF8F0]">
              Pure Sweet Perfection
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-white font-sans font-medium leading-relaxed drop-shadow-md bg-black/40 backdrop-blur-sm px-6 py-3 rounded-2xl max-w-2xl mx-auto border border-white/10">
            Handcrafted artisanal cakes, traditional Pakistani mithai, hot fast food, and morning fresh bakery delights baked daily in the heart of Timergara.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/menu"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#7B1E3A] hover:bg-[#9B2A4A] text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl hover:scale-105 flex items-center justify-center gap-2 group"
            >
              <span>Explore Bakery Menu</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105"
            >
              Order & Contact Us
            </Link>
          </div>
        </div>

        {/* Floating Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/60 flex flex-col items-center space-y-2 animate-bounce">
          <span className="text-[10px] uppercase tracking-widest">Scroll To Discover</span>
          <div className="w-5 h-9 rounded-full border-2 border-cream/40 flex justify-center pt-2">
            <div className="w-1 h-2 bg-[#C9982F] rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* 2. SIGNATURE PRODUCTS SHOWCASE */}
      <section ref={signatureSecRef} className="py-24 bg-[#FFF8F0] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7B1E3A]">
              Baker's Showcase
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#3D2418]">
              Our Signature Delights
            </h2>
            <p className="text-sm text-stone-600 font-sans">
              Hand-selected customer favorites crafted with secret family recipes and premium ingredients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {signatureItems.map((item, index) => (
              <div
                key={index}
                className="sig-card bg-white rounded-3xl overflow-hidden shadow-xl border border-[#C9982F]/20 flex flex-col group hover:-translate-y-2 transition-transform duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <span className="absolute top-4 left-4 bg-[#7B1E3A] text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">
                    {item.tag}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-heading font-bold text-xl text-[#3D2418] mb-2 group-hover:text-[#7B1E3A] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                    <span className="font-heading font-bold text-lg text-[#C9982F]">
                      {item.price}
                    </span>
                    <Link
                      to="/menu"
                      className="text-xs font-bold text-[#7B1E3A] hover:text-[#3D2418] uppercase tracking-wider flex items-center gap-1"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BRAND STORY TEASER (Dynamic Background Color Transition) */}
      <section
        ref={storySecRef}
        className="py-24 transition-colors duration-700 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Story Image Grid */}
            <div className="relative space-y-4">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#C9982F]/30 h-[400px]">
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80"
                  alt="Bakery Craftsmanship"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#7B1E3A] text-white p-6 rounded-2xl shadow-xl hidden sm:block max-w-xs border border-[#C9982F]/40">
                <div className="flex items-center gap-1 text-[#C9982F] mb-1">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
                <p className="text-xs font-sans font-light italic">
                  "The most delicious Gulab Jamun and freshest cakes in all of Dir Lower!"
                </p>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9982F] block mt-2">
                  — Local Customer Review
                </span>
              </div>
            </div>

            {/* Story Text */}
            <div className="space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9982F]">
                Our Legacy & Passion
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold leading-tight">
                Crafting Joy, One Sweet Bite at a Time
              </h2>
              <p className="text-sm sm:text-base leading-relaxed opacity-90 font-sans">
                Located in the heart of Timergara Bazaar, <strong>Halwiyat Zamzam Bakers</strong> has been the benchmark of authentic sweets, birthday cakes, hot fast food snacks, and morning pastries.
              </p>
              <p className="text-sm sm:text-base leading-relaxed opacity-80 font-sans">
                Our master halwais and bakers prepare everything from scratch using traditional methods, pure desi ghee, organic milk, and freshly ground cardamom.
              </p>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C9982F] text-[#3D2418] font-bold text-xs uppercase tracking-widest hover:bg-[#E0B653] transition-colors shadow-lg"
                >
                  <span>Read Full Brand Story</span>
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-24 bg-[#F5EDE3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7B1E3A]">
              The Zamzam Promise
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#3D2418]">
              Why Timergara Chooses Us
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-white p-8 rounded-3xl shadow-lg border border-[#C9982F]/20 text-center space-y-4 flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#FFF8F0] border border-[#C9982F]/30 flex items-center justify-center">
                  {feat.icon}
                </div>
                <h3 className="font-heading font-bold text-lg text-[#3D2418]">
                  {feat.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="py-20 bg-gradient-to-r from-[#7B1E3A] via-[#5C3A2E] to-[#3D2418] text-white relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6 relative z-10">
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-[#FFF8F0]">
            Planning a Wedding, Birthday, or Special Event?
          </h2>
          <p className="text-sm sm:text-base text-cream/90 font-sans max-w-2xl mx-auto">
            Order custom tiered cakes, wholesale sweet boxes, or party fast-food platters directly via WhatsApp or phone.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/menu"
              className="px-8 py-4 rounded-full bg-[#C9982F] hover:bg-[#E0B653] text-[#3D2418] font-bold text-xs uppercase tracking-widest transition-transform hover:scale-105 shadow-2xl"
            >
              Browse Full Menu
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs uppercase tracking-widest transition-transform hover:scale-105"
            >
              Contact Timergara Shop
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
