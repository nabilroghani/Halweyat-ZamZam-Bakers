import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductService } from '../../services/api';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiSearch, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { getSocket } from '../../store/useSocket';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('Sweets');
  const [imageUrl, setImageUrl] = useState('');
  const [unit, setUnit] = useState('Kg');
  const [weightOptionsInput, setWeightOptionsInput] = useState('250g, 500g, 1 Kg, 2 Kg');
  const [isFeatured, setIsFeatured] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await ProductService.getAll();
      setProducts(data || []);
    } catch (error) {
      alert('Failed to load products: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // 🔌 Socket.IO Real-Time Product Listeners
  useEffect(() => {
    const socket = getSocket();

    const handleProductAdded = (newProduct) => {
      setProducts(prev => [newProduct, ...prev.filter(p => p._id !== newProduct._id)]);
    };

    const handleProductUpdated = (updatedProduct) => {
      setProducts(prev => prev.map(p => p._id === updatedProduct._id ? updatedProduct : p));
    };

    const handleProductDeleted = (data) => {
      setProducts(prev => prev.filter(p => p._id !== data._id));
    };

    const handleStockUpdated = (data) => {
      setProducts(prev => prev.map(p => p._id === data._id ? { ...p, isAvailable: data.isAvailable } : p));
    };

    socket.on('product-added', handleProductAdded);
    socket.on('product-updated', handleProductUpdated);
    socket.on('product-deleted', handleProductDeleted);
    socket.on('product-stock-updated', handleStockUpdated);

    return () => {
      socket.off('product-added', handleProductAdded);
      socket.off('product-updated', handleProductUpdated);
      socket.off('product-deleted', handleProductDeleted);
      socket.off('product-stock-updated', handleStockUpdated);
    };
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice('');
    setOriginalPrice('');
    setCategory('Sweets');
    setImageUrl('https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600');
    setUnit('Kg');
    setWeightOptionsInput('250g, 500g, 1 Kg, 2 Kg');
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setName(p.name);
    setDescription(p.description);
    setPrice(p.price);
    setOriginalPrice(p.originalPrice || 0);
    setCategory(p.category);
    setImageUrl(p.imageUrl);
    setUnit(p.unit || 'Piece');
    setWeightOptionsInput(p.weightOptions && p.weightOptions.length > 0 ? p.weightOptions.join(', ') : '');
    setIsFeatured(p.isFeatured || false);
    setIsModalOpen(true);
  };

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    if (!editingProduct) {
      if (newCat === 'Fast Food') {
        setUnit('Piece');
        setWeightOptionsInput('Small, Medium, Large, Family');
      } else if (newCat === 'Cakes' || newCat === 'Custom Cakes') {
        setUnit('Pound');
        setWeightOptionsInput('1.5 Lb, 2 Lb, 3 Lb, 5 Lb');
      } else if (newCat === 'Sweets' || newCat === 'Nimko & Snacks') {
        setUnit('Kg');
        setWeightOptionsInput('250g, 500g, 1 Kg, 2 Kg');
      } else if (newCat === 'Bakery Items') {
        setUnit('Piece');
        setWeightOptionsInput('1 Piece, Box of 6, Box of 12');
      } else if (newCat === 'Deals') {
        setUnit('Pack');
        setWeightOptionsInput('Standard Combo');
      }
    }
  };

  const applyPreset = (presetUnit, presetOptions) => {
    setUnit(presetUnit);
    setWeightOptionsInput(presetOptions);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const weightOptionsArray = weightOptionsInput
        ? weightOptionsInput.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      const payload = {
        name,
        description,
        price: Number(price),
        originalPrice: Number(originalPrice || 0),
        category,
        imageUrl,
        unit: unit || 'Piece',
        weightOptions: weightOptionsArray,
        isFeatured
      };

      if (editingProduct) {
        await ProductService.update(editingProduct._id, payload);
      } else {
        await ProductService.create(payload);
      }

      setIsModalOpen(false);
      loadProducts();
    } catch (error) {
      alert('Error saving product: ' + error.message);
    }
  };

  const handleToggleStock = async (id) => {
    try {
      await ProductService.toggleStock(id);
      loadProducts();
    } catch (error) {
      alert('Failed to update stock status: ' + error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await ProductService.delete(id);
      loadProducts();
    } catch (error) {
      alert('Failed to delete product: ' + error.message);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0d0d11] text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-6">
          <div>
            <Link to="/admin/dashboard" className="text-xs text-amber-400 hover:underline">
              ← Back to Dashboard Overview
            </Link>
            <h1 className="text-3xl font-bold font-serif gold-gradient-text mt-1">
              Product & Menu Manager
            </h1>
            <p className="text-xs text-gray-400">Add new bakery items, set custom portion sizes/units, and control live stock</p>
          </div>

          <button
            onClick={openAddModal}
            className="px-5 py-3 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
          >
            <FiPlus className="text-base" /> Add New Item to Menu
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3.5 top-3.5 text-gray-500 text-sm" />
          <input 
            type="text" 
            placeholder="Search items by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#14141a] border border-amber-500/20 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Products Table */}
        <div className="bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 overflow-hidden">
          {loading ? (
            <p className="text-xs text-gray-400 py-8 text-center">Loading product catalog...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-amber-500/10 text-gray-400 uppercase text-[10px]">
                    <th className="py-3 px-3">Item</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Price & Unit</th>
                    <th className="py-3 px-3">Portion / Sizes</th>
                    <th className="py-3 px-3">Stock Status</th>
                    <th className="py-3 px-3">Featured</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-500/10 text-gray-300">
                  {filteredProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-amber-500/5">
                      <td className="py-3 px-3 flex items-center gap-3">
                        <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-amber-500/20" />
                        <div>
                          <div className="font-bold text-white">{p.name}</div>
                          <div className="text-[10px] text-gray-500 line-clamp-1">{p.description}</div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded text-[10px]">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-amber-400">
                        Rs. {p.price} <span className="text-[10px] text-gray-400 font-normal">/ {p.unit || 'Piece'}</span>
                      </td>
                      <td className="py-3 px-3 text-[10px] text-gray-400 max-w-xs">
                        {p.weightOptions && p.weightOptions.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {p.weightOptions.map((opt, i) => (
                              <span key={i} className="bg-[#181820] text-gray-300 border border-amber-500/10 px-1.5 py-0.5 rounded">
                                {opt}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-600">Standard</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleToggleStock(p._id)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition ${
                            p.isAvailable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {p.isAvailable ? <FiToggleRight className="text-sm" /> : <FiToggleLeft className="text-sm" />}
                          {p.isAvailable ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        {p.isFeatured ? (
                          <span className="text-amber-400 text-[10px] font-bold">★ Featured</span>
                        ) : (
                          <span className="text-gray-600 text-[10px]">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openEditModal(p)}
                            className="p-1.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded-lg"
                          >
                            <FiEdit2 />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(p._id)}
                            className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 max-w-lg w-full space-y-4 my-8">
              <div className="flex justify-between items-center border-b border-amber-500/20 pb-3">
                <h3 className="text-lg font-bold font-serif text-amber-400">
                  {editingProduct ? 'Edit Product Options' : 'Add New Bakery Item'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                  <FiX className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Item Name *</label>
                  <input 
                    type="text" required
                    placeholder="e.g. Chicken Tikka Pizza, Gulab Jamun, Red Velvet Cake"
                    value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-300 mb-1">Category *</label>
                    <select 
                      value={category} onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full px-3 py-2 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Sweets">Sweets</option>
                      <option value="Cakes">Cakes</option>
                      <option value="Custom Cakes">Custom Cakes</option>
                      <option value="Bakery Items">Bakery Items</option>
                      <option value="Fast Food">Fast Food</option>
                      <option value="Nimko & Snacks">Nimko & Snacks</option>
                      <option value="Deals">Deals</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-300 mb-1">Base Price (Rs.) *</label>
                    <input 
                      type="number" required
                      placeholder="e.g. 850"
                      value={price} onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-300 mb-1">Unit / Pricing Metric *</label>
                    <select
                      value={unit} onChange={(e) => setUnit(e.target.value)}
                      className="w-full px-3 py-2 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Piece">Piece (Pizza, Burger, Patties, Drinks)</option>
                      <option value="Pound">Pound (Cakes)</option>
                      <option value="Kg">Kg (Sweets, Mithai, Nimko)</option>
                      <option value="Gram">Gram (250g, 500g)</option>
                      <option value="Pack">Pack / Deal</option>
                      <option value="Box">Box</option>
                      <option value="Bottle">Bottle</option>
                      <option value="Plate">Plate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-300 mb-1">Original Price (Discount Slash)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 1000 (Optional)"
                      value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Weight / Portion / Size Options */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-bold text-gray-300">Portion / Size & Custom Price Options</label>
                    <span className="text-[10px] text-amber-400 font-bold">💡 Format: Size - Rs. Price</span>
                  </div>
                  <input 
                    type="text"
                    placeholder="e.g. Small - Rs. 650, Medium - Rs. 1100, Large - Rs. 1650, Family - Rs. 2400"
                    value={weightOptionsInput} onChange={(e) => setWeightOptionsInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400 font-mono text-[11px]"
                  />
                  <div className="mt-1.5 p-2 bg-[#121216] border border-amber-500/10 rounded-xl text-[10px] text-gray-400 space-y-1">
                    <p className="text-amber-400 font-bold">✨ How Custom Pricing Works:</p>
                    <p>• Write custom price for each size: <code className="text-amber-300 bg-black/40 px-1 rounded">Small - Rs. 650, Medium - Rs. 1100, Large - Rs. 1650</code></p>
                    <p>• Or write sizes without prices (e.g. <code className="text-gray-300">Small, Medium, Large</code>) for automatic percentage calculation.</p>
                  </div>
                  
                  <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-wider">Quick Presets (Click to Auto-fill Custom Prices):</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <button type="button" onClick={() => applyPreset('Piece', 'Small - Rs. 650, Medium - Rs. 1100, Large - Rs. 1650, Family - Rs. 2400')} className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-[10px] font-medium transition">
                      🍕 Pizza Sizes & Prices
                    </button>
                    <button type="button" onClick={() => applyPreset('Pound', '1 Lb - Rs. 600, 2 Lbs - Rs. 1200, 3 Lbs - Rs. 1800, 5 Lbs - Rs. 3000')} className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-[10px] font-medium transition">
                      🎂 Cake Pounds & Prices
                    </button>
                    <button type="button" onClick={() => applyPreset('Kg', '250g - Rs. 200, 500g - Rs. 400, 1 Kg - Rs. 800, 2 Kg - Rs. 1600')} className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-[10px] font-medium transition">
                      🍬 Sweets Weight & Prices
                    </button>
                    <button type="button" onClick={() => applyPreset('Piece', '1 Piece - Rs. 80, Box of 6 - Rs. 450, Box of 12 - Rs. 850')} className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-[10px] font-medium transition">
                      🥐 Bakery Items & Prices
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-bold text-gray-300">Product Image (File Upload or URL) *</label>
                    <span className="text-[10px] text-amber-400 font-bold">☁️ Cloudinary Upload Ready</span>
                  </div>
                  
                  <div className="space-y-2">
                    {/* Direct File Picker for Cloudinary */}
                    <div className="flex items-center gap-2">
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onloadend = async () => {
                            try {
                              const token = localStorage.getItem('zamzam_auth_token');
                              const res = await fetch('/api/upload', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({ image: reader.result })
                              });
                              const data = await res.json();
                              if (data.url) {
                                setImageUrl(data.url);
                                alert('✅ Image uploaded successfully to Cloudinary!');
                              } else {
                                alert('Upload fallback: Using local image preview');
                                setImageUrl(reader.result);
                              }
                            } catch (err) {
                              setImageUrl(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500/20 file:text-amber-400 hover:file:bg-amber-500/30 cursor-pointer"
                      />
                    </div>

                    <input 
                      type="text" required
                      placeholder="https://..."
                      value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400 font-mono text-[11px]"
                    />
                  </div>

                  {imageUrl && (
                    <div className="mt-2 flex items-center gap-3 bg-[#121216] p-2 rounded-xl border border-amber-500/10">
                      <img src={imageUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-amber-500/30 shrink-0" />
                      <span className="text-[10px] text-emerald-400 font-mono line-clamp-1">Preview Loaded: {imageUrl}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">Description *</label>
                  <textarea 
                    required rows={2}
                    value={description} onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)}
                      className="accent-amber-500"
                    />
                    <span className="text-gray-300">Feature on Homepage</span>
                  </label>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-amber-500/10">
                  <button 
                    type="button" onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-[#181820] text-gray-300 rounded-xl hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
