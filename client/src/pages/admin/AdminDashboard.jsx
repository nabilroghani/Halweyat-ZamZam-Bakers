import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductService, OrderService, ContactService } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { FiBox, FiShoppingBag, FiMail, FiUsers, FiPlus, FiCheckCircle, FiClock, FiRefreshCw } from 'react-icons/fi';

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const [productsCount, setProductsCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [inquiriesCount, setInquiriesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const pData = await ProductService.getAll();
      setProductsCount(pData.length || 0);

      const oData = await OrderService.getAll();
      setOrders(oData || []);

      const cData = await ContactService.getAll();
      setInquiriesCount(cData.length || 0);
    } catch (error) {
      console.error('Metrics loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-[#0d0d11] text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-6">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-md border border-amber-500/20">
              Role: {user?.role?.toUpperCase() || 'STAFF'}
            </span>
            <h1 className="text-3xl font-bold font-serif gold-gradient-text mt-2">
              Welcome back, {user?.name || 'Manager'}
            </h1>
            <p className="text-xs text-gray-400">Halwiyat Zamzam Bakers • Real-time Operations Portal</p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={loadMetrics}
              className="p-2.5 bg-[#181820] border border-amber-500/20 rounded-xl text-amber-400 hover:bg-amber-500/10 transition"
              title="Refresh Stats"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            </button>
            <Link
              to="/admin/products"
              className="px-4 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-amber-400 transition"
            >
              <FiPlus /> Add New Product
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-xs rounded-xl hover:bg-red-500/20 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Dashboard Nav Bar */}
        <div className="flex gap-4 border-b border-amber-500/10 pb-4 text-xs font-bold">
          <Link to="/admin/dashboard" className="text-amber-400 border-b-2 border-amber-400 pb-2">Overview</Link>
          <Link to="/admin/products" className="text-gray-400 hover:text-amber-300 pb-2">Product Catalog</Link>
          <Link to="/admin/orders" className="text-gray-400 hover:text-amber-300 pb-2 flex items-center gap-1.5">
            Orders Manager
            {pendingOrders.length > 0 && (
              <span className="bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-full text-[10px]">
                {pendingOrders.length}
              </span>
            )}
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin/users" className="text-gray-400 hover:text-amber-300 pb-2 flex items-center gap-1.5">
              <FiUsers /> Staff RBAC
            </Link>
          )}
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-[#14141a] border border-amber-500/20 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Products</span>
              <div className="p-2 bg-amber-500/10 rounded-lg"><FiBox className="text-lg" /></div>
            </div>
            <div className="text-3xl font-bold font-serif text-white">{productsCount}</div>
            <p className="text-[11px] text-amber-200/60">Active Menu Items in Catalog</p>
          </div>

          <div className="bg-[#14141a] border border-amber-500/20 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Pending Orders</span>
              <div className="p-2 bg-amber-500/10 rounded-lg"><FiClock className="text-lg" /></div>
            </div>
            <div className="text-3xl font-bold font-serif text-amber-400">{pendingOrders.length}</div>
            <p className="text-[11px] text-amber-200/60">Awaiting Counter Action</p>
          </div>

          <div className="bg-[#14141a] border border-amber-500/20 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Orders</span>
              <div className="p-2 bg-emerald-500/10 rounded-lg"><FiShoppingBag className="text-lg" /></div>
            </div>
            <div className="text-3xl font-bold font-serif text-white">{orders.length}</div>
            <p className="text-[11px] text-emerald-300/60">Recorded in Database</p>
          </div>

          <div className="bg-[#14141a] border border-amber-500/20 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Revenue</span>
              <div className="p-2 bg-amber-500/10 rounded-lg"><FiCheckCircle className="text-lg" /></div>
            </div>
            <div className="text-2xl font-bold font-mono text-amber-300">Rs. {totalRevenue}</div>
            <p className="text-[11px] text-amber-200/60">Order Volume</p>
          </div>

        </div>

        {/* Recent Orders Overview */}
        <div className="bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold font-serif text-amber-400">Recent Customer Orders</h3>
            <Link to="/admin/orders" className="text-xs text-amber-300 hover:underline font-semibold">
              View All Orders →
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">No customer orders placed yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-amber-500/10 text-gray-400 uppercase text-[10px]">
                    <th className="py-3 px-3">Order ID</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Total Amount</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-500/10 text-gray-300">
                  {orders.slice(0, 5).map((ord) => (
                    <tr key={ord._id} className="hover:bg-amber-500/5">
                      <td className="py-3 px-3 font-mono font-bold text-amber-400">#{ord.orderId}</td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">{ord.customerName}</div>
                        <div className="text-[10px] text-gray-500">{ord.customerPhone}</div>
                      </td>
                      <td className="py-3 px-3">{ord.orderType}</td>
                      <td className="py-3 px-3 font-bold text-white">Rs. {ord.totalAmount}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          ord.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                          ord.status === 'Ready' ? 'bg-blue-500/20 text-blue-400' :
                          ord.status === 'Preparing' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
