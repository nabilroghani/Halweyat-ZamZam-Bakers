import React, { useState, useEffect } from 'react';
import { BannerService } from '../../services/api';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiImage, FiToggleLeft, FiToggleRight, FiUpload, FiStar } from 'react-icons/fi';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badge, setBadge] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState('1');

  const loadBanners = async () => {
    setLoading(true);
    try {
      const data = await BannerService.getAll(true);
      setBanners(data || []);
    } catch (error) {
      alert('Failed to load hero banners: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const openAddModal = () => {
    setEditingBanner(null);
    setTitle('Halwiyat Zamzam Grand Anniversary Sale');
    setSubtitle('Celebrating 10 years of sweet traditions in Timergara!');
    setBadge('🎉 10TH ANNIVERSARY SPECIAL');
    setImageUrl('https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1920');
    setDisplayOrder((banners.length + 1).toString());
    setIsModalOpen(true);
  };

  const openEditModal = (b) => {
    setEditingBanner(b);
    setTitle(b.title || '');
    setSubtitle(b.subtitle || '');
    setBadge(b.badge || '');
    setImageUrl(b.imageUrl || '');
    setDisplayOrder((b.displayOrder || 1).toString());
    setIsModalOpen(true);
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    if (!imageUrl) {
      alert('Please upload or enter a Banner Image URL');
      return;
    }

    try {
      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        badge: badge.trim(),
        imageUrl: imageUrl.trim(),
        displayOrder: Number(displayOrder) || 1
      };

      if (editingBanner) {
        await BannerService.update(editingBanner._id, payload);
      } else {
        await BannerService.create(payload);
      }

      setIsModalOpen(false);
      loadBanners();
    } catch (error) {
      alert('Failed to save banner: ' + error.message);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await BannerService.toggle(id);
      loadBanners();
    } catch (error) {
      alert('Failed to toggle status: ' + error.message);
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hero slider banner?')) return;
    try {
      await BannerService.delete(id);
      loadBanners();
    } catch (error) {
      alert('Failed to delete banner: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d11] text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 shadow-2xl">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.25em] text-amber-400">
              Homepage Operations
            </span>
            <h1 className="text-3xl font-bold font-serif gold-gradient-text mt-1">
              Hero Slider Banners Manager
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Upload custom anniversary banners, promotional images, and optional titles to display on the storefront home slider.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-amber-500/20 transition flex items-center gap-2"
          >
            <FiPlus className="text-base" /> Add New Hero Banner
          </button>
        </div>

        {/* Banners Grid / List */}
        {loading ? (
          <div className="text-center py-16 text-amber-400 font-bold text-sm">
            Loading Hero Banners...
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center py-16 bg-[#14141a] border border-dashed border-amber-500/20 rounded-3xl p-8">
            <FiImage className="text-4xl text-amber-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No Hero Banners Added Yet</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto mt-1 mb-4">
              Add your first anniversary or promotion banner to display on the home page slider.
            </p>
            <button
              onClick={openAddModal}
              className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
            >
              ➕ Create First Banner
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((b, idx) => (
              <div 
                key={b._id || idx}
                className={`bg-[#14141a] border rounded-3xl overflow-hidden shadow-2xl transition flex flex-col justify-between ${
                  b.isActive ? 'border-amber-500/30' : 'border-gray-800 opacity-60'
                }`}
              >
                {/* Banner Image Preview */}
                <div className="relative h-48 bg-black overflow-hidden group">
                  <img 
                    src={b.imageUrl} 
                    alt={b.title || 'Banner'} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-between p-4">
                    <div className="flex justify-between items-start">
                      <span className="bg-black/60 backdrop-blur-md text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        Order #{b.displayOrder || idx + 1}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        b.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {b.isActive ? 'Active Live' : 'Hidden'}
                      </span>
                    </div>

                    {b.badge && (
                      <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full inline-block max-w-max">
                        {b.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Info Details */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white font-serif">
                      {b.title || <span className="text-gray-500 italic font-sans text-xs">(Image-Only Banner - No Title)</span>}
                    </h3>
                    {b.subtitle && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{b.subtitle}</p>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-amber-500/10 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleActive(b._id)}
                      className={`flex items-center gap-1.5 text-xs font-bold transition px-3 py-1.5 rounded-xl border ${
                        b.isActive 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                          : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
                      }`}
                      title="Toggle visibility on home slider"
                    >
                      {b.isActive ? <FiToggleRight className="text-lg text-emerald-400" /> : <FiToggleLeft className="text-lg" />}
                      <span>{b.isActive ? 'Active' : 'Disabled'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(b)}
                        className="p-2 text-amber-400 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 rounded-xl transition"
                        title="Edit Banner"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDeleteBanner(b._id)}
                        className="p-2 text-red-400 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 rounded-xl transition"
                        title="Delete Banner"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Modal for Add / Edit Banner */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#14141a] border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl space-y-6">
              
              <div className="flex justify-between items-center border-b border-amber-500/20 pb-4">
                <h3 className="text-xl font-bold font-serif gold-gradient-text flex items-center gap-2">
                  <FiImage className="text-amber-400" />
                  {editingBanner ? 'Edit Hero Banner' : 'Create New Hero Banner'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white p-1">
                  <FiX className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleSaveBanner} className="space-y-4 text-xs">
                
                {/* Image Upload / URL */}
                <div>
                  <label className="block font-bold text-gray-300 mb-1">
                    Banner Image (Required) *
                  </label>
                  
                  <div className="space-y-2">
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
                              alert('✅ Banner image uploaded successfully to Cloudinary!');
                            } else {
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

                    <input 
                      type="text" 
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400 font-mono text-[11px]"
                    />
                  </div>

                  {imageUrl && (
                    <div className="mt-2 relative h-32 rounded-xl overflow-hidden border border-amber-500/30">
                      <img src={imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] text-amber-400 font-mono">
                        Live Preview
                      </span>
                    </div>
                  )}
                </div>

                {/* Optional Badge Tag */}
                <div>
                  <label className="block font-bold text-gray-300 mb-1 flex items-center justify-between">
                    <span>Top Badge Tag (Optional)</span>
                    <span className="text-[10px] text-amber-400 font-normal">e.g. 🎉 10TH ANNIVERSARY SALE</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Leave empty if no badge desired"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3 py-2 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Optional Title */}
                <div>
                  <label className="block font-bold text-gray-300 mb-1 flex items-center justify-between">
                    <span>Main Heading Title (Optional)</span>
                    <span className="text-[10px] text-amber-400 font-normal">Leave blank for image-only banner</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Halwiyat Zamzam Grand Sale"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400 font-serif"
                  />
                </div>

                {/* Optional Subtitle */}
                <div>
                  <label className="block font-bold text-gray-300 mb-1 flex items-center justify-between">
                    <span>Description Subtitle (Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief banner description text..."
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Display Order */}
                <div>
                  <label className="block font-bold text-gray-300 mb-1">
                    Display Sequence Order (1, 2, 3...)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full px-3 py-2 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400 font-mono font-bold"
                  />
                </div>

                {/* Modal Buttons */}
                <div className="flex gap-3 pt-3 border-t border-amber-500/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 bg-[#181820] text-gray-400 font-bold rounded-xl hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
                  >
                    <FiCheck className="text-base" /> {editingBanner ? 'Save Changes' : 'Create Banner'}
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
