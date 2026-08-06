import React, { useState } from 'react';
import { AuthService } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiKey, FiLock, FiEye, FiEyeOff, FiCheckCircle, FiRefreshCw, FiX } from 'react-icons/fi';

export default function ForgotPasswordModal({ onClose, redirectPath = '/my-orders' }) {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP + New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Step 1: Send 6-Digit Password Reset OTP Code
  const handleSendResetCode = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid active email address.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await AuthService.forgotPassword({ email: email.trim() });
      setSuccessMsg(res.message || `A 6-digit reset code has been sent to ${email}`);
      setStep(2);
    } catch (err) {
      setError(err.message || 'No account found with this email address.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Code & Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      setError('Please enter the 6-digit reset code received in your Gmail inbox.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await AuthService.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword
      });

      if (res.token) {
        localStorage.setItem('zamzam_auth_token', res.token);
        useAuthStore.setState({
          user: {
            _id: res._id,
            name: res.name,
            email: res.email,
            phone: res.phone,
            role: res.role,
            address: res.address
          },
          token: res.token
        });
        
        onClose();
        if (res.role === 'admin' || res.role === 'receptionist') {
          navigate('/admin/dashboard');
        } else {
          navigate(redirectPath);
        }
      }
    } catch (err) {
      setError(err.message || 'Password reset failed. Incorrect or expired 6-digit code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#14141a] border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-amber-500/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl">
              <FiKey />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif gold-gradient-text">Reset Your Password</h3>
              <p className="text-[11px] text-gray-400">Halwiyat Zamzam Security</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Banners */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-emerald-400 text-xs text-center font-medium flex items-center justify-center gap-2">
            <FiCheckCircle /> {successMsg}
          </div>
        )}

        {step === 1 ? (
          /* STEP 1: Enter Email */
          <form onSubmit={handleSendResetCode} className="space-y-4">
            <p className="text-xs text-gray-300 leading-relaxed">
              Enter your registered Gmail address below. We will send you a <strong className="text-amber-400">6-digit reset code</strong> to create a new password.
            </p>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#181820] border border-amber-500/20 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
            >
              {loading ? <FiRefreshCw className="animate-spin text-base" /> : <FiKey className="text-base" />}
              {loading ? 'Sending Code...' : 'Send 6-Digit Reset Code'}
            </button>
          </form>
        ) : (
          /* STEP 2: Enter OTP + New Password */
          <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
            <div className="p-3 bg-[#181820] border border-amber-500/20 rounded-xl font-mono text-amber-300 text-center font-bold">
              <FiMail className="inline mr-1" /> {email}
            </div>

            <div>
              <label className="block font-bold text-gray-300 mb-1 text-center uppercase tracking-wider">
                Enter 6-Digit Reset Code
              </label>
              <input
                type="text"
                maxLength="6"
                required
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="••••••"
                className="w-full py-3 px-4 bg-[#181820] border-2 border-amber-500/30 rounded-xl text-amber-400 text-center font-mono font-extrabold text-2xl tracking-[0.4em] focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-300 mb-1">New Password *</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-10 py-2.5 bg-[#181820] border border-amber-500/20 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
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
              disabled={loading || otp.length !== 6 || newPassword.length < 6}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
            >
              {loading ? <FiRefreshCw className="animate-spin text-base" /> : <FiCheckCircle className="text-base" />}
              {loading ? 'Updating Password...' : 'Save New Password & Login'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-gray-400 hover:text-white underline text-[11px]"
              >
                ← Back to Step 1
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
