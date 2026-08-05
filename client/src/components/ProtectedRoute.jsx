import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-[#0d0d11] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-3xl max-w-md space-y-4">
          <h2 className="text-2xl font-bold font-serif text-red-400">Access Denied (403)</h2>
          <p className="text-xs text-gray-300">
            Your role (<strong className="text-amber-400">{user.role}</strong>) does not have permission to view this page.
          </p>
          <a href="/" className="inline-block px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl">
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  return children;
}
