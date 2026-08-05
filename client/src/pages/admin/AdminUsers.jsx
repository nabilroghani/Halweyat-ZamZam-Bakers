import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthService, fetchAPI } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { FiUsers, FiUserPlus, FiShield, FiX, FiCheck, FiLock } from 'react-icons/fi';

export default function AdminUsers() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  if (user?.role === 'receptionist') {
    return (
      <div className="min-h-screen bg-[#0d0d11] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#14141a] border border-amber-500/20 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl mx-auto flex items-center justify-center text-amber-400 text-3xl">
            <FiLock />
          </div>
          <h2 className="text-xl font-bold font-serif gold-gradient-text">Admin Access Restricted</h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Staff & RBAC account management is restricted to Store Managers & Admins. Receptionists manage counter orders and receipts.
          </p>
          <Link
            to="/admin/orders"
            className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
          >
            Go to Counter Orders Desk →
          </Link>
        </div>
      </div>
    );
  }

  // Staff creation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('receptionist');

  const [submitting, setSubmitting] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await AuthService.getAllUsers();
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await AuthService.createStaff({ name, email, phone, password, role });
      alert(`Staff account created successfully! Role: ${role.toUpperCase()}`);
      setIsModalOpen(false);
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      loadUsers();
    } catch (error) {
      alert('Failed to create staff account: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

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
              Staff & User Security RBAC Portal
            </h1>
            <p className="text-xs text-gray-400">Manage Admin, Receptionist, and Customer permissions</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
          >
            <FiUserPlus className="text-base" /> Create New Staff Account
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 overflow-hidden">
          {loading ? (
            <p className="text-xs text-gray-400 py-8 text-center">Loading accounts directory...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-amber-500/10 text-gray-400 uppercase text-[10px]">
                    <th className="py-3 px-3">Name</th>
                    <th className="py-3 px-3">Email</th>
                    <th className="py-3 px-3">Phone</th>
                    <th className="py-3 px-3">RBAC Role</th>
                    <th className="py-3 px-3">Access Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-500/10 text-gray-300">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-amber-500/5">
                      <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                          {u.name ? u.name[0].toUpperCase() : 'U'}
                        </div>
                        {u.name}
                      </td>
                      <td className="py-3 px-3 text-amber-300/80 font-mono">{u.email}</td>
                      <td className="py-3 px-3">{u.phone || '-'}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          u.role === 'admin' ? 'bg-amber-500 text-slate-950' :
                          u.role === 'receptionist' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-800 text-gray-400'
                        }`}>
                          {u.role ? u.role.toUpperCase() : 'CUSTOMER'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-400 text-[10px]">
                        {u.role === 'admin' ? 'Full SuperAdmin Privileges' :
                         u.role === 'receptionist' ? 'Counter Orders & Kitchen Queue' :
                         'Storefront Online Ordering'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 max-w-md w-full space-y-4">
              <div className="flex justify-between items-center border-b border-amber-500/20 pb-3">
                <h3 className="text-lg font-bold font-serif text-amber-400">Create Staff Account</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                  <FiX className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-300 mb-1">Staff Name *</label>
                  <input 
                    type="text" required
                    value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Counter Manager"
                    className="w-full px-3 py-2 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">Email Address *</label>
                  <input 
                    type="email" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="reception2@zamzam.com"
                    className="w-full px-3 py-2 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">Phone Number</label>
                  <input 
                    type="tel"
                    value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="0345 9000125"
                    className="w-full px-3 py-2 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">Password *</label>
                  <input 
                    type="password" required
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-300 mb-1">RBAC Role *</label>
                  <select 
                    value={role} onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="receptionist">Receptionist (Counter & Order Desk)</option>
                    <option value="admin">Admin (Full Owner Access)</option>
                  </select>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button" onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-[#181820] text-gray-300 rounded-xl hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" disabled={submitting}
                    className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400"
                  >
                    {submitting ? 'Creating...' : 'Create Staff User'}
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
