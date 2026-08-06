import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthService } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { FiUser, FiMail, FiLock, FiPhone, FiHome, FiEye, FiEyeOff } from 'react-icons/fi';
import { isValidEmail, isValidPakistaniPhone } from '../utils/validation';
import GoogleLoginButton from '../components/GoogleLoginButton';
import OtpVerificationModal from '../components/OtpVerificationModal';

export default function CustomerRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/my-orders';

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Strict Client Validation
    if (!isValidEmail(email)) {
      setError('Please enter a valid active email address (e.g. name@example.com)');
      return;
    }

    if (!isValidPakistaniPhone(phone)) {
      setError('Please enter a valid Pakistani mobile number (e.g. 03275001166 or 03001234567)');
      return;
    }

    setLoading(true);

    try {
      const result = await AuthService.register({ name, email, phone, password, address });
      if (result.requiresOtp) {
        setPendingEmail(result.email || email);
        setShowOtpModal(true);
      } else {
        await login(email, password);
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d11] text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {showOtpModal && (
        <OtpVerificationModal
          email={pendingEmail}
          redirectPath={redirectPath}
          onClose={() => setShowOtpModal(false)}
        />
      )}

      <div className="max-w-md w-full bg-[#14141a] border border-amber-500/20 rounded-3xl p-8 shadow-2xl space-y-6">
        
        <div className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Create Verified Account
          </span>
          <h2 className="text-2xl font-bold font-serif gold-gradient-text mt-2">
            Join Halwiyat Zamzam
          </h2>
          <p className="text-xs text-gray-400 mt-1">Register to order fresh sweets & custom cakes easily</p>
        </div>

        {/* Google Sign-In Option */}
        <GoogleLoginButton redirectPath={redirectPath} label="Sign up with Google" />

        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-[1px] bg-amber-500/10" />
          <span className="text-[10px] uppercase font-bold text-gray-500">Or Register with Email</span>
          <div className="flex-1 h-[1px] bg-amber-500/10" />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-300 mb-1">Full Name *</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3.5 text-gray-500" />
              <input 
                type="text" required
                placeholder="e.g. Muhammad Khan"
                value={name} onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-300 mb-1">Email Address *</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3.5 text-gray-500" />
              <input 
                type="email" required
                placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-300 mb-1">Phone Number (WhatsApp) *</label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-3.5 text-gray-500" />
              <input 
                type="tel" required
                placeholder="0345 1234567"
                value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-300 mb-1">Delivery Address (Optional)</label>
            <div className="relative">
              <FiHome className="absolute left-3 top-3.5 text-gray-500" />
              <input 
                type="text"
                placeholder="Main Street, Timergara"
                value={address} onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-300 mb-1">Password *</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3.5 text-gray-500" />
              <input 
                type={showPassword ? 'text' : 'password'} required
                placeholder="At least 6 characters"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-amber-400 transition"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition"
          >
            {loading ? 'Creating Account...' : 'Register & Continue'}
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 pt-2 border-t border-amber-500/10">
          Already have an account?{' '}
          <Link to={`/login${redirectPath ? `?redirect=${redirectPath}` : ''}`} className="text-amber-400 font-bold hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
}
