import React, { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { FiCheck, FiShoppingBag, FiStar, FiHeart, FiUpload, FiImage, FiX } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function CustomCakeBuilder() {
  const addToCart = useCartStore((state) => state.addToCart);

  const flavors = [
    { name: 'Belgian Dark Chocolate Fudge', priceMultiplier: 1.2, bg: 'from-amber-950 to-stone-900', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600' },
    { name: 'Red Velvet Supreme', priceMultiplier: 1.15, bg: 'from-rose-950 to-stone-900', img: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600' },
    { name: 'Vanilla Madagascar Bean', priceMultiplier: 1.0, bg: 'from-amber-900/40 to-stone-900', img: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600' },
    { name: 'Pineapple Fresh Cream', priceMultiplier: 1.05, bg: 'from-yellow-950 to-stone-900', img: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600' }
  ];

  const weightOptions = [
    { name: '2 Lbs (Standard Party)', basePrice: 2200, serves: '6-8 Persons' },
    { name: '3 Lbs (Medium Celebration)', basePrice: 3200, serves: '10-12 Persons' },
    { name: '5 Lbs (Grand 2-Tier)', basePrice: 5500, serves: '18-22 Persons' },
    { name: '8 Lbs (Royal Wedding Tier)', basePrice: 8800, serves: '30+ Persons' }
  ];

  const shapes = ['Classic Round', 'Romantic Heart', 'Modern Square', 'Custom Tiered'];

  const [selectedFlavor, setSelectedFlavor] = useState(flavors[0]);
  const [selectedWeight, setSelectedWeight] = useState(weightOptions[0]);
  const [selectedShape, setSelectedShape] = useState(shapes[0]);
  const [toppingMessage, setToppingMessage] = useState('Happy Birthday!');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [customPhoto, setCustomPhoto] = useState(null);
  const [customPhotoName, setCustomPhotoName] = useState('');
  const [added, setAdded] = useState(false);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo size should be under 5MB');
      return;
    }

    setCustomPhotoName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCustomPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setCustomPhoto(null);
    setCustomPhotoName('');
  };

  const basePrice = selectedWeight.basePrice;
  const flavorAddon = Math.round(selectedWeight.basePrice * (selectedFlavor.priceMultiplier - 1));
  const photoFee = customPhoto ? 300 : 0;
  const calculatedPrice = basePrice + flavorAddon + photoFee;

  const handleAddToCart = () => {
    const customCakeProduct = {
      _id: `custom-cake-${Date.now()}`,
      name: `Custom ${selectedShape} Cake (${selectedFlavor.name})`,
      price: calculatedPrice,
      imageUrl: customPhoto || selectedFlavor.img,
      unit: 'Lb',
      isCustomCake: true,
      customCakeDetails: {
        flavor: selectedFlavor.name,
        weight: selectedWeight.name,
        shape: selectedShape,
        toppingMessage: toppingMessage || 'No text requested',
        specialInstructions: specialInstructions || '',
        basePrice,
        flavorAddon,
        photoFee,
        referencePhotoAttached: Boolean(customPhoto)
      }
    };

    const detailsStr = `${selectedWeight.name} (Rs. ${basePrice}) • ${selectedFlavor.name}${photoFee > 0 ? ' • Photo Ref Fee: Rs. 300' : ''}${specialInstructions ? ` • Note: "${specialInstructions}"` : ''}`;
    addToCart(customCakeProduct, 1, detailsStr);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleDirectWhatsApp = () => {
    let msg = `*🎂 CUSTOM CAKE SPECIAL ORDER - HALWIYAT ZAMZAM BAKERS (TIMERGARA) 🎂*\n\n`;
    msg += `🍰 *Flavor*: ${selectedFlavor.name}\n`;
    msg += `⚖️ *Weight*: ${selectedWeight.name} (${selectedWeight.serves})\n`;
    msg += `📐 *Shape*: ${selectedShape}\n`;
    msg += `✍️ *Text on Cake*: "${toppingMessage}"\n`;
    if (customPhotoName) msg += `📸 *Custom Design Reference*: Attached photo file ("${customPhotoName}") (Fee: Rs. 300)\n`;
    if (specialInstructions) msg += `📝 *Design Vision Notes*: ${specialInstructions}\n`;
    msg += `\n💵 *Price Breakdown*:\n`;
    msg += `  • Base Weight: Rs. ${basePrice}\n`;
    if (flavorAddon > 0) msg += `  • Premium Flavor Addon: Rs. ${flavorAddon}\n`;
    if (photoFee > 0) msg += `  • Photo Processing Fee: Rs. ${photoFee}\n`;
    msg += `  • *TOTAL CAKE PRICE*: *Rs. ${calculatedPrice}*\n`;
    msg += `\nPlease confirm order preparation and pickup time!`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/923275001166?text=${encoded}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0d0d11] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
            Interactive Cake Studio
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-serif gold-gradient-text mt-4 mb-3">
            Design Your Dream Cake
          </h1>
          <p className="text-sm text-gray-400">
            Select your flavor, weight, shape, and custom topping message. Crafted fresh daily by Timergara's master pastry chefs!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Preview & Summary Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="relative h-64 rounded-2xl overflow-hidden border border-amber-500/20 shadow-inner group">
              <img 
                src={selectedFlavor.img} 
                alt={selectedFlavor.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">{selectedShape}</span>
                <h3 className="text-xl font-bold font-serif text-white">{selectedFlavor.name}</h3>
              </div>
            </div>

            {/* Customization Live Itemized Price Breakdown Summary */}
            <div className="space-y-2.5 bg-[#181820] p-4 rounded-xl border border-amber-500/10 text-xs">
              <div className="flex justify-between text-gray-300">
                <span>Selected Weight:</span>
                <span className="font-bold text-amber-300">{selectedWeight.name} (Rs. {basePrice})</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Serving Size:</span>
                <span className="text-gray-400">{selectedWeight.serves}</span>
              </div>

              {flavorAddon > 0 && (
                <div className="flex justify-between text-amber-300 font-medium">
                  <span>Flavor Premium ({selectedFlavor.name}):</span>
                  <span>+ Rs. {flavorAddon}</span>
                </div>
              )}

              {photoFee > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  <span>📸 Custom Photo Reference Fee:</span>
                  <span>+ Rs. 300</span>
                </div>
              )}

              <div className="flex justify-between text-gray-300 pt-1">
                <span>Topping Message:</span>
                <span className="font-serif italic text-amber-400">"{toppingMessage || 'None'}"</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-amber-400 pt-3 border-t border-amber-500/10">
                <span>Total Cake Price:</span>
                <span className="text-xl font-mono">Rs. {calculatedPrice}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xl transition ${
                  added
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                }`}
              >
                <FiShoppingBag className="text-lg" /> {added ? 'Added Custom Cake to Cart!' : 'Add Custom Cake to Cart'}
              </button>

              <button
                onClick={handleDirectWhatsApp}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/30 transition"
              >
                <FaWhatsapp className="text-lg" /> Order via WhatsApp Direct
              </button>
            </div>
          </div>

          {/* Right Customization Options */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Select Flavor */}
            <div className="bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 space-y-4">
              <h3 className="text-lg font-bold font-serif text-amber-400 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xs">1</span>
                Choose Cake Flavor
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {flavors.map((f, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedFlavor(f)}
                    className={`p-4 rounded-2xl border text-left flex gap-3 items-center transition ${
                      selectedFlavor.name === f.name
                        ? 'bg-amber-500/10 border-amber-400 shadow-lg shadow-amber-500/10'
                        : 'bg-[#181820] border-amber-500/10 hover:border-amber-500/30'
                    }`}
                  >
                    <img src={f.img} alt={f.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{f.name}</h4>
                      <span className="text-[10px] text-amber-400/80">Premium Recipe</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Weight */}
            <div className="bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 space-y-4">
              <h3 className="text-lg font-bold font-serif text-amber-400 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xs">2</span>
                Select Cake Size & Weight
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {weightOptions.map((w, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedWeight(w)}
                    className={`p-4 rounded-2xl border text-left transition ${
                      selectedWeight.name === w.name
                        ? 'bg-amber-500/10 border-amber-400 shadow-lg shadow-amber-500/10'
                        : 'bg-[#181820] border-amber-500/10 hover:border-amber-500/30'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-white">{w.name}</h4>
                      <span className="text-xs font-mono font-bold text-amber-400">Rs. {w.basePrice}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">{w.serves}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Cake Shape & Text Topping */}
            <div className="bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 space-y-4">
              <h3 className="text-lg font-bold font-serif text-amber-400 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xs">3</span>
                Shape & Personal Message
              </h3>

              {/* Shape Buttons */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">Cake Shape</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {shapes.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedShape(s)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                        selectedShape === s
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-[#181820] text-gray-300 border-amber-500/10 hover:border-amber-500/30'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Text on Cake */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Text to write on Cake (Cream Icing)
                </label>
                <input 
                  type="text" 
                  value={toppingMessage}
                  onChange={(e) => setToppingMessage(e.target.value)}
                  placeholder="e.g. Happy Birthday Ahmed!"
                  className="w-full px-4 py-2.5 bg-[#181820] border border-amber-500/20 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 font-serif"
                />
              </div>

              {/* Custom Design Reference Photo Upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center justify-between">
                  <span>Upload Reference Photo / Design Idea (Optional)</span>
                  <span className="text-[10px] text-amber-400 font-normal">Max 5MB</span>
                </label>
                
                {customPhoto ? (
                  <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img src={customPhoto} alt="Cake reference" className="w-10 h-10 object-cover rounded-lg border border-amber-500/40" />
                      <div className="truncate">
                        <span className="block font-bold text-amber-300 truncate">{customPhotoName}</span>
                        <span className="block text-[10px] text-emerald-400">✅ Custom Photo Attached</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
                      title="Remove Photo"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-4 border border-dashed border-amber-500/30 hover:border-amber-400/60 rounded-xl bg-[#181820] cursor-pointer group transition">
                    <FiUpload className="text-amber-400 text-lg group-hover:scale-110 transition" />
                    <span className="text-xs text-gray-300 font-medium">Click to select photo / cake sample from device</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                )}
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Special Design Notes (Color theme, dietary requests, etc.)
                </label>
                <textarea 
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Describe your design vision or specific request..."
                  rows={2}
                  className="w-full px-4 py-2.5 bg-[#181820] border border-amber-500/20 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
