import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { AuthService } from '../services/api';
import { FiUser, FiPhone, FiMapPin, FiMail, FiSave, FiArrowLeft, FiCheckCircle, FiShoppingBag } from 'react-icons/fi';

export default function CustomerProfile() {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0d0d11] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#14141a] border border-amber-500/20 rounded-3xl p-8 text-center space-y-4">
          <FiUser className="text-4xl text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold font-serif gold-gradient-text">Please Sign In</h2>
          <p className="text-xs text-gray-400">You need to be logged in to view your profile.</p>
          <Link to="/login" className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl">
            Sign In →
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const updated = await AuthService.updateProfile({ name, phone, address });
      // Update global auth store with new user data (and optionally new token)
      setUser({ ...user, name: updated.name, phone: updated.phone, address: updated.address });
      if (updated.token) {
        localStorage.setItem('zamzam_token', updated.token);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d11] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/my-orders')}
            className="p-2.5 bg-[#14141a] border border-amber-500/20 rounded-xl text-amber-400 hover:bg-amber-500/10 transition"
          >
            <FiArrowLeft />
          </button>
          <div>
            <h1 className="text-3xl font-bold font-serif gold-gradient-text">My Profile</h1>
            <p className="text-xs text-gray-400 mt-0.5">Update your name, phone number, and delivery address</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-[#14141a] border border-amber-500/20 rounded-3xl p-8 shadow-2xl space-y-6">

          {/* Avatar + Account Info */}
          <div className="flex items-center gap-5 pb-6 border-b border-amber-500/10">
            <div className="w-16 h-16 bg-amber-500/10 border-2 border-amber-500/40 rounded-full flex items-center justify-center text-amber-400 text-2xl font-extrabold uppercase">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="text-lg font-bold text-white font-serif">{user.name}</div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                <FiMail className="text-amber-400" />
                <span>{user.email}</span>
              </div>
              <div className="mt-1">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  user.role === 'admin' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  user.role === 'receptionist' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {user.role || 'Customer'}
                </span>
              </div>
            </div>
          </div>

          {/* Success / Error Banners */}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
              <FiCheckCircle className="shrink-0" />
              Profile updated successfully! Your information has been saved.
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-red-400 text-xs">
              {error}
            </div>
          )}

          {/* Edit Form */}
          <form onSubmit={handleSave} className="space-y-5 text-xs">
            <div>
              <label className="block font-bold text-gray-300 mb-2">
                Full Name <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-3.5 text-gray-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-3 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-300 mb-2">Phone Number</label>
              <div className="relative">
                <FiPhone className="absolute left-3.5 top-3.5 text-gray-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0327-5001166"
                  className="w-full pl-10 pr-4 py-3 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400 transition"
                />
              </div>
              <p className="text-gray-500 mt-1 text-[11px]">Used for order updates and WhatsApp notifications.</p>
            </div>

            <div>
              <label className="block font-bold text-gray-300 mb-2">Default Delivery Address</label>
              <div className="relative">
                <FiMapPin className="absolute left-3.5 top-3.5 text-gray-500" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. House No. 5, Main Bazaar, Timergara, Dir Lower"
                  className="w-full pl-10 pr-4 py-3 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400 transition"
                />
              </div>
              <p className="text-gray-500 mt-1 text-[11px]">This address will be auto-filled during checkout.</p>
            </div>

            <div className="pt-2">
              <label className="block font-bold text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 bg-[#0d0d11] border border-amber-500/10 rounded-xl text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="text-gray-500 mt-1 text-[11px]">Email cannot be changed for security reasons.</p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
              >
                <FiSave />
                {loading ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
              <Link
                to="/my-orders"
                className="py-3.5 px-5 bg-[#181820] hover:bg-[#20202a] text-gray-300 font-bold rounded-xl border border-amber-500/10 flex items-center gap-2 transition"
              >
                <FiShoppingBag /> My Orders
              </Link>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
