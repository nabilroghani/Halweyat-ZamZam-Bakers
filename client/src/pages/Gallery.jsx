import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExpand, FaXmark, FaWhatsapp } from 'react-icons/fa6';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = ['All', 'Cakes', 'Sweets', 'Fast Food', 'Bakery Items', 'Drinks'];

  const galleryItems = [
    {
      id: 1,
      title: 'Royal Black Forest Cake',
      category: 'Cakes',
      img: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=1000&q=80',
      desc: 'Multi-layer chocolate sponge garnished with sweet red cherries and rich cocoa shavings.',
    },
    {
      id: 2,
      title: 'Special Shahi Gulab Jamun',
      category: 'Sweets',
      img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=80',
      desc: 'Golden khoya dumplings drenched in hot saffron & cardamom sugar syrup.',
    },
    {
      id: 3,
      title: 'Red Velvet Supreme Cake',
      category: 'Cakes',
      img: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=1000&q=80',
      desc: 'Moist crimson velvet layers topped with velvety smooth cream cheese frosting.',
    },
    {
      id: 4,
      title: 'Crispy Chicken Patties',
      category: 'Fast Food',
      img: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1000&q=80',
      desc: 'Flaky baked puff pastry filled with seasoned chicken breast.',
    },
    {
      id: 5,
      title: 'Zafrani Rasmalai Bowl',
      category: 'Sweets',
      img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80',
      desc: 'Soft cottage cheese discs submerged in saffron & pistachio milk broth.',
    },
    {
      id: 6,
      title: 'Glazed Donut Delights',
      category: 'Bakery Items',
      img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=80',
      desc: 'Golden fried yeast donut dipped in rich chocolate ganache.',
    },
    {
      id: 7,
      title: 'Fresh Citrus Orange Juice',
      category: 'Drinks',
      img: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=1000&q=80',
      desc: '100% natural, freshly pressed seasonal citrus orange juice.',
    },
    {
      id: 8,
      title: 'Creamy Mango Smoothie',
      category: 'Drinks',
      img: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=1000&q=80',
      desc: 'Thick blend of ripe mangoes, ice cream, and chilled milk.',
    },
    {
      id: 9,
      title: 'Fresh Butter Croissants',
      category: 'Bakery Items',
      img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=80',
      desc: 'Flaky golden French croissants baked fresh every morning.',
    },
  ];

  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <div className="pt-28 pb-24 min-h-screen bg-[#FFF8F0]">
      {/* Header */}
      <div className="bg-[#3D2418] text-white py-16 text-center mb-12">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9982F]">
            Visual Showcase
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-[#FFF8F0]">
            The Sweet Gallery
          </h1>
          <p className="text-sm sm:text-base text-cream/80 max-w-xl mx-auto font-sans font-light">
            A visual feast of our handcrafted cakes, traditional mithai, fast food, and drinks.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'bg-[#7B1E3A] text-white shadow-md'
                  : 'bg-white text-[#3D2418] border border-[#C9982F]/20 hover:bg-[#F5EDE3]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedImage(item)}
                className="relative h-72 rounded-3xl overflow-hidden shadow-lg border border-[#C9982F]/20 group cursor-pointer"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9982F] mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-heading font-bold text-lg leading-snug">{item.title}</h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-cream/80">
                    <FaExpand className="text-[#C9982F]" />
                    <span>Click to expand</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#3D2418] text-[#FFF8F0] rounded-3xl overflow-hidden max-w-3xl w-full border border-[#C9982F]/40 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#7B1E3A] transition-colors"
                aria-label="Close modal"
              >
                <FaXmark />
              </button>

              <div className="h-96 w-full overflow-hidden bg-black">
                <img
                  src={selectedImage.img}
                  alt={selectedImage.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8 space-y-4">
                <span className="text-xs uppercase font-bold tracking-widest text-[#C9982F]">
                  {selectedImage.category}
                </span>
                <h3 className="font-heading text-2xl font-bold text-[#FFF8F0]">
                  {selectedImage.title}
                </h3>
                <p className="text-xs text-cream/80 leading-relaxed font-sans">
                  {selectedImage.desc}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <a
                    href={`https://wa.me/923275001166?text=${encodeURIComponent(`Hello! I saw ${selectedImage.title} in the gallery and would like to order.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1eb957] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow"
                  >
                    <FaWhatsapp className="text-base" />
                    <span>Order via WhatsApp</span>
                  </a>

                  <button
                    onClick={() => setSelectedImage(null)}
                    className="text-xs text-cream/60 hover:text-white uppercase tracking-wider"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
