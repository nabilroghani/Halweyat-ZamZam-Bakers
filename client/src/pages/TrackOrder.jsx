import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { OrderService } from '../services/api';
import { FiSearch, FiPackage, FiClock, FiCheckCircle, FiPhone, FiMapPin, FiRefreshCw, FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_STEPS = ['Pending', 'Preparing', 'Ready', 'Delivered'];

const STATUS_CONFIG = {
  Pending:   { color: 'text-amber-400',  bg: 'bg-amber-500/20',   border: 'border-amber-500/40',   label: 'Order Received',    icon: '⏳', eta: '5-10 mins' },
  Preparing: { color: 'text-blue-400',   bg: 'bg-blue-500/20',    border: 'border-blue-500/40',    label: 'Being Prepared',    icon: '👨‍🍳', eta: '15-30 mins' },
  Ready:     { color: 'text-emerald-400',bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', label: 'Ready for Pickup/Delivery', icon: '✅', eta: '5-10 mins' },
  Delivered: { color: 'text-emerald-400',bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', label: 'Delivered',          icon: '🎉', eta: 'Completed' },
  Cancelled: { color: 'text-red-400',    bg: 'bg-red-500/20',     border: 'border-red-500/40',     label: 'Order Cancelled',   icon: '❌', eta: 'N/A' }
};

export default function TrackOrder() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');
    setResults(null);
    setSearched(true);

    try {
      const data = await OrderService.track(trimmed);
      setResults(data || []);
    } catch (err) {
      setError('Could not fetch order details. Please check your Order ID or phone number.');
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status) => STATUS_STEPS.indexOf(status);

  return (
    <div className="min-h-screen bg-[#0d0d11] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">

        {/* Page Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
            📦 Real-Time Order Tracker
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-serif gold-gradient-text">
            Track Your Order
          </h1>
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            Enter your Order ID (e.g. <strong className="text-amber-400">HZB-1234</strong>) or your registered Phone Number to track your order status in real time.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-4 text-gray-400 text-base" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Order ID (HZB-1234) or Phone Number..."
                className="w-full pl-11 pr-4 py-3.5 bg-[#181820] border border-amber-500/20 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition whitespace-nowrap"
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiSearch />}
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </form>

          <p className="text-[11px] text-gray-500 text-center">
            You can also track by calling us at{' '}
            <a href="tel:+923275001166" className="text-amber-400 font-bold hover:underline">+92 327 5001166</a>
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* No Results */}
        {searched && !loading && results && results.length === 0 && !error && (
          <div className="text-center bg-[#14141a] border border-amber-500/10 rounded-3xl p-10 space-y-4">
            <span className="text-5xl">🔍</span>
            <h3 className="font-serif font-bold text-xl text-amber-400">No Orders Found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              We couldn't find any orders matching "<strong>{query}</strong>". Make sure you entered the correct Order ID or phone number.
            </p>
            <Link to="/menu" className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:underline">
              Browse Our Menu <FiArrowRight />
            </Link>
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {results && results.length > 0 && results.map((order, i) => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['Pending'];
            const stepIdx = getStepIndex(order.status);
            const isCancelled = order.status === 'Cancelled';

            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/10 pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-amber-400 text-lg">#{order.orderId}</span>
                      {order.isCustomCake && (
                        <span className="text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                          🎂 Custom Cake
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Placed: {new Date(order.createdAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                    <span>{cfg.icon}</span>
                    <span>{cfg.label}</span>
                  </div>
                </div>

                {/* Progress Tracker (not shown for cancelled) */}
                {!isCancelled && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Order Progress</h4>
                    <div className="flex items-center gap-0 overflow-x-auto pb-2">
                      {STATUS_STEPS.map((step, idx) => {
                        const isCompleted = stepIdx > idx;
                        const isCurrent = stepIdx === idx;
                        return (
                          <React.Fragment key={step}>
                            <div className="flex flex-col items-center gap-1.5 min-w-[80px]">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                                isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' :
                                isCurrent ? 'bg-amber-500/20 border-amber-400 text-amber-400 animate-pulse' :
                                'bg-[#181820] border-gray-700 text-gray-600'
                              }`}>
                                {isCompleted ? <FiCheckCircle /> : idx + 1}
                              </div>
                              <span className={`text-[9px] font-bold text-center uppercase tracking-wide ${
                                isCurrent ? 'text-amber-400' : isCompleted ? 'text-emerald-400' : 'text-gray-600'
                              }`}>
                                {step === 'Pending' ? 'Received' : step}
                              </span>
                            </div>
                            {idx < STATUS_STEPS.length - 1 && (
                              <div className={`flex-1 h-0.5 mb-6 min-w-[30px] rounded ${
                                stepIdx > idx ? 'bg-emerald-500' : 'bg-gray-700'
                              }`} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>

                    {/* ETA Badge */}
                    {order.status !== 'Delivered' && (
                      <div className="flex items-center gap-2 text-xs bg-[#181820] border border-amber-500/10 px-4 py-2.5 rounded-xl">
                        <FiClock className="text-amber-400 shrink-0" />
                        <span className="text-gray-300">
                          Estimated Time: <strong className="text-amber-400">{cfg.eta}</strong>
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Cancelled Notice */}
                {isCancelled && (
                  <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl text-red-400 text-xs space-y-1">
                    <div className="font-bold text-sm">❌ Order Cancelled</div>
                    {order.cancelReason && <div>Reason: {order.cancelReason}</div>}
                    <div className="pt-1">
                      Contact us at <a href="tel:+923275001166" className="underline font-bold">+92 327 5001166</a> for assistance.
                    </div>
                  </div>
                )}

                {/* Order Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <FiPhone className="text-amber-400" />
                      <span>{order.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <FiMapPin className="text-amber-400" />
                      <span>{order.customerAddress}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <FiPackage className="text-amber-400" />
                      <span>{order.orderType} • {order.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-[#181820] p-3 rounded-xl border border-amber-500/10">
                    <div className="text-[10px] uppercase font-bold text-gray-500 mb-2">Items Ordered</div>
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-gray-300">
                        <span>{item.quantity}x {item.name} <span className="text-gray-500">({item.selectedOption})</span></span>
                        <span className="text-amber-400 font-mono font-bold">Rs. {item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t border-amber-500/10 pt-2 flex justify-between font-bold text-amber-400">
                      <span>Total</span>
                      <span className="font-mono">Rs. {order.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Follow-up */}
                <a
                  href={`https://wa.me/923275001166?text=${encodeURIComponent(`Hi! I'm following up on my order #${order.orderId}. Customer: ${order.customerName}. Please update me on the status.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 font-bold text-xs rounded-xl transition"
                >
                  <FaWhatsapp className="text-base" /> Message Us on WhatsApp About This Order
                </a>
              </motion.div>
            );
          })}
        </AnimatePresence>

      </div>
    </div>
  );
}
