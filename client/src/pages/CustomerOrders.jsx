import React, { useState, useEffect } from 'react';
import { OrderService } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { FiShoppingBag, FiClock, FiCheckCircle, FiUser, FiMapPin, FiPhone, FiShield, FiKey } from 'react-icons/fi';

export default function CustomerOrders() {
  const { user, logout, toggleJwtModal } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      setLoading(true);
      try {
        const data = await OrderService.getMyOrders();
        setOrders(data || []);
      } catch (error) {
        console.error('Error loading my orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d11] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Customer Profile Header */}
        <div className="bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl font-serif font-bold">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-serif gold-gradient-text">{user?.name}</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full">
                  Customer
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                <span className="flex items-center gap-1"><FiPhone className="text-amber-400" /> {user?.phone || 'No phone'}</span>
                <span className="flex items-center gap-1"><FiMapPin className="text-amber-400" /> {user?.address || 'Timergara'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-xs rounded-xl hover:bg-red-500/20 transition"
          >
            Sign Out Account
          </button>
        </div>

        {/* Orders Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-serif text-amber-400 flex items-center gap-2">
            <FiShoppingBag /> Your Order History & Live Tracking
          </h2>

          {loading ? (
            <p className="text-xs text-gray-400 py-12 text-center">Loading your order history...</p>
          ) : orders.length === 0 ? (
            <div className="bg-[#14141a] border border-amber-500/10 rounded-3xl p-12 text-center space-y-3">
              <FiShoppingBag className="text-5xl text-amber-500/20 mx-auto" />
              <h3 className="text-lg font-bold text-amber-400 font-serif">No Orders Found Yet</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                You haven't placed any online orders yet. Explore our fresh sweets & bakery menu to order!
              </p>
              <a href="/menu" className="inline-block px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl">
                Browse Menu
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div 
                  key={ord._id}
                  className="bg-[#14141a] border border-amber-500/20 rounded-2xl p-6 space-y-4 hover:border-amber-500/40 transition"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-amber-500/10 pb-3">
                    <div>
                      <span className="text-xs text-gray-400">Order ID: </span>
                      <span className="font-mono font-bold text-amber-400 text-sm">#{ord.orderId}</span>
                      <span className="text-[11px] text-gray-500 ml-3">{new Date(ord.createdAt).toLocaleDateString()}</span>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      ord.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                      ord.status === 'Ready' ? 'bg-blue-500/20 text-blue-400' :
                      ord.status === 'Preparing' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      Stage: {ord.status}
                    </span>
                  </div>

                  {/* Items list */}
                  <div className="space-y-2">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="text-gray-300">
                          <strong className="text-white">{it.name}</strong> ({it.selectedOption}) x {it.quantity}
                        </span>
                        <span className="font-mono text-amber-400">Rs. {it.price * it.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-amber-500/10 text-xs">
                    <span className="text-gray-400">Type: <strong className="text-white">{ord.orderType}</strong></span>
                    <span className="text-sm font-bold text-amber-400">Total: Rs. {ord.totalAmount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
