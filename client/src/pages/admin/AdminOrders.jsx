import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { OrderService } from '../../services/api';
import { FiShoppingBag, FiSearch, FiCheckCircle, FiClock, FiCheck, FiPrinter, FiX } from 'react-icons/fi';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await OrderService.getAll({ status: statusFilter, search });
      setOrders(data || []);
    } catch (error) {
      alert('Failed to load orders: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, search]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await OrderService.updateStatus(orderId, newStatus);
      loadOrders();
    } catch (error) {
      alert('Failed to update order status: ' + error.message);
    }
  };

  const statuses = ['All', 'Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

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
              Receptionist & Counter Order Desk
            </h1>
            <p className="text-xs text-gray-400">Manage live customer orders, update kitchen preparation stage, and print counter receipts</p>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 custom-scrollbar">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  statusFilter === s
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-[#14141a] text-gray-400 border border-amber-500/10 hover:border-amber-500/30'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3.5 top-3.5 text-gray-500 text-sm" />
            <input 
              type="text" 
              placeholder="Search Order ID, Name, Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#14141a] border border-amber-500/20 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 overflow-hidden">
          {loading ? (
            <p className="text-xs text-gray-400 py-8 text-center">Loading orders queue...</p>
          ) : orders.length === 0 ? (
            <p className="text-xs text-gray-400 py-8 text-center">No orders match the selected status filter.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-amber-500/10 text-gray-400 uppercase text-[10px]">
                    <th className="py-3 px-3">Order #</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Type & Address</th>
                    <th className="py-3 px-3">Items Summary</th>
                    <th className="py-3 px-3">Total Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-500/10 text-gray-300">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-amber-500/5">
                      <td className="py-4 px-3 font-mono font-bold text-amber-400">#{ord.orderId}</td>
                      <td className="py-4 px-3">
                        <div className="font-bold text-white">{ord.customerName}</div>
                        <div className="text-[11px] text-amber-300/80 font-mono">{ord.customerPhone}</div>
                      </td>
                      <td className="py-4 px-3">
                        <span className="text-[11px] font-bold text-gray-300 block">{ord.orderType}</span>
                        <span className="text-[10px] text-gray-500 line-clamp-1">{ord.customerAddress}</span>
                      </td>
                      <td className="py-4 px-3">
                        <div className="space-y-1">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="text-[11px] text-gray-300">
                              • <span className="font-semibold text-white">{it.name}</span> ({it.selectedOption}) x {it.quantity}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-3 font-mono font-bold text-amber-400 text-sm">
                        Rs. {ord.totalAmount}
                      </td>
                      <td className="py-4 px-3">
                        <select 
                          value={ord.status}
                          onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#181820] border border-amber-500/20 focus:outline-none ${
                            ord.status === 'Delivered' ? 'text-emerald-400 border-emerald-500/40' :
                            ord.status === 'Ready' ? 'text-blue-400 border-blue-500/40' :
                            ord.status === 'Preparing' ? 'text-amber-400 border-amber-500/40' :
                            'text-red-400 border-red-500/40'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Ready">Ready</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-4 px-3 text-right">
                        <button
                          onClick={() => setSelectedReceipt(ord)}
                          className="px-3 py-1.5 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 rounded-lg text-[11px] font-bold inline-flex items-center gap-1.5"
                        >
                          <FiPrinter /> Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Counter Receipt Modal */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#181820] border border-amber-500/30 rounded-3xl p-6 max-w-md w-full space-y-6 text-white">
              
              <div className="flex justify-between items-center border-b border-amber-500/20 pb-4">
                <div>
                  <h3 className="text-xl font-bold font-serif gold-gradient-text">Halwiyat Zamzam Bakers</h3>
                  <p className="text-[10px] text-amber-200/60 uppercase tracking-wider">Timergara Branch Counter Invoice</p>
                </div>
                <button onClick={() => setSelectedReceipt(null)} className="text-gray-400 hover:text-white">
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Receipt Body */}
              <div className="space-y-4 text-xs font-mono bg-[#121216] p-4 rounded-xl border border-amber-500/10">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>Order ID: #{selectedReceipt.orderId}</span>
                  <span>{new Date(selectedReceipt.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <p>Customer: <strong>{selectedReceipt.customerName}</strong></p>
                  <p>Phone: {selectedReceipt.customerPhone}</p>
                  <p>Type: {selectedReceipt.orderType}</p>
                </div>

                <div className="border-t border-b border-dashed border-white/20 py-3 space-y-2">
                  {selectedReceipt.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{it.quantity}x {it.name} ({it.selectedOption})</span>
                      <span>Rs. {it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between font-bold text-amber-400 text-sm pt-1">
                  <span>TOTAL PAYABLE</span>
                  <span>Rs. {selectedReceipt.totalAmount}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 py-3 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-amber-400"
                >
                  <FiPrinter /> Print Receipt
                </button>
                <button 
                  onClick={() => setSelectedReceipt(null)}
                  className="py-3 px-4 bg-[#121216] text-gray-300 font-bold text-xs rounded-xl hover:bg-gray-800"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
