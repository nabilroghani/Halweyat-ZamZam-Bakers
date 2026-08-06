import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { FiMail, FiLock, FiUserCheck, FiEye, FiEyeOff } from 'react-icons/fi';
import GoogleLoginButton from '../components/GoogleLoginButton';
import OtpVerificationModal from '../components/OtpVerificationModal';
import ForgotPasswordModal from '../components/ForgotPasswordModal';

export default function CustomerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/my-orders';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(email, password);
      if (userData?.requiresOtp) {
        setPendingEmail(userData.email || email);
        setShowOtpModal(true);
      } else if (userData.role === 'admin' || userData.role === 'receptionist') {
        navigate('/admin/dashboard');
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      if (err.requiresOtp) {
        setPendingEmail(err.email || email);
        setShowOtpModal(true);
      } else {
        setError(err.message || 'Login failed. Invalid email or password.');
      }
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

      {showForgotModal && (
        <ForgotPasswordModal
          redirectPath={redirectPath}
          onClose={() => setShowForgotModal(false)}
        />
      )}

      <div className="max-w-md w-full bg-[#14141a] border border-amber-500/20 rounded-3xl p-8 shadow-2xl space-y-6">
        
        <div className="text-center">
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl mx-auto flex items-center justify-center text-amber-400 text-2xl mb-3">
            <FiUserCheck />
          </div>
          <h2 className="text-2xl font-bold font-serif gold-gradient-text">Sign In to Your Account</h2>
          <p className="text-xs text-gray-400 mt-1">Enter your email and password to access your account</p>
        </div>

        {/* Google Sign-In Button */}
        <GoogleLoginButton redirectPath={redirectPath} label="Sign in with Google" />

        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-[1px] bg-amber-500/10" />
          <span className="text-[10px] uppercase font-bold text-gray-500">Or Sign In with Email</span>
          <div className="flex-1 h-[1px] bg-amber-500/10" />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3.5 text-gray-500" />
              <input 
                type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-bold text-gray-300">Password</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] text-amber-400 hover:underline font-semibold"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <FiLock className="absolute left-3 top-3.5 text-gray-500" />
              <input 
                type={showPassword ? 'text' : 'password'} required
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 pt-2 border-t border-amber-500/10 flex justify-center">
          <p>Don't have an account?{' '}
            <Link to={`/register${redirectPath ? `?redirect=${redirectPath}` : ''}`} className="text-amber-400 font-bold hover:underline ml-1">
              Register New Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
