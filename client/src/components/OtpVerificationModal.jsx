import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { AuthService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiCheckCircle, FiRefreshCw, FiX, FiShield, FiKey } from 'react-icons/fi';

export default function OtpVerificationModal({ email, onClose, redirectPath = '/my-orders' }) {
  const { verifyOtp } = useAuthStore();
  const navigate = useNavigate();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendSuccess, setResendSuccess] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      setError('Please enter the full 6-digit code sent to your email.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const userData = await verifyOtp(email, otp.trim());
      if (userData.role === 'admin' || userData.role === 'receptionist') {
        navigate('/admin/dashboard');
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err.message || 'Verification failed. Incorrect or expired code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResendSuccess('');
    try {
      await AuthService.resendOtp({ email });
      setResendSuccess(`A new 6-digit code has been sent to ${email}`);
      setTimeout(() => setResendSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to resend code.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#14141a] border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Ambient Blur */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex justify-between items-start border-b border-amber-500/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl">
              <FiKey />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif gold-gradient-text">Verify Email Account</h3>
              <p className="text-[11px] text-gray-400">Halwiyat Zamzam Security</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Message */}
        <div className="space-y-2 text-xs">
          <p className="text-gray-300 leading-relaxed">
            We sent a <strong className="text-amber-400">6-digit verification code</strong> to:
          </p>
          <div className="p-3 bg-[#181820] border border-amber-500/20 rounded-xl font-mono text-amber-300 text-center font-bold flex items-center justify-center gap-2">
            <FiMail /> {email}
          </div>
          <p className="text-[11px] text-gray-500">
            Please check your Gmail inbox (or Spam folder) and enter the code below to activate your account.
          </p>
        </div>

        {/* Banners */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}
        {resendSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-emerald-400 text-xs text-center font-medium flex items-center justify-center gap-2">
            <FiCheckCircle /> {resendSuccess}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2 text-center uppercase tracking-wider">
              Enter 6-Digit Code
            </label>
            <input
              type="text"
              maxLength="6"
              required
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="••••••"
              className="w-full py-3.5 px-4 bg-[#181820] border-2 border-amber-500/30 rounded-xl text-amber-400 text-center font-mono font-extrabold text-2xl tracking-[0.4em] focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
          >
            {loading ? <FiRefreshCw className="animate-spin text-base" /> : <FiCheckCircle className="text-base" />}
            {loading ? 'Verifying Code...' : 'Activate & Login Account'}
          </button>
        </form>

        {/* Resend Link & Change Email */}
        <div className="text-center text-xs text-gray-400 pt-3 border-t border-amber-500/10 flex flex-col sm:flex-row justify-between items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white underline text-[11px]"
          >
            ✏️ Wrong Email? Enter Real Email
          </button>
          <button
            type="button"
            onClick={handleResend}
            className="text-amber-400 font-bold hover:underline"
          >
            Resend 6-Digit Code
          </button>
        </div>

      </div>
    </div>
  );
}
