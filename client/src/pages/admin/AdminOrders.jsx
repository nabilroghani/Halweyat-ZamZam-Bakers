import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { OrderService, ProductService } from '../../services/api';
import { FiShoppingBag, FiSearch, FiCheckCircle, FiClock, FiCheck, FiPrinter, FiX, FiPlus, FiPhone, FiUser, FiSlash, FiCamera, FiMaximize2, FiEye, FiWifi } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { getSocket } from '../../store/useSocket';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [liveAlert, setLiveAlert] = useState(null);

  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [zoomedImageModal, setZoomedImageModal] = useState(null);

  // Counter POS Order Modal State
  const [isPosOpen, setIsPosOpen] = useState(false);
  const [posCustomerName, setPosCustomerName] = useState('');
  const [posCustomerPhone, setPosCustomerPhone] = useState('');
  const [posOrderType, setPosOrderType] = useState('Pickup');
  const [posItemName, setPosItemName] = useState('Special Shahi Gulab Jamun');
  const [posOption, setPosOption] = useState('1 Kg');
  const [posPrice, setPosPrice] = useState('850');
  const [posQuantity, setPosQuantity] = useState('1');
  const [posSubmitting, setPosSubmitting] = useState(false);

  // Products list for POS dropdown
  const [posProducts, setPosProducts] = useState([]);

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

  // Load products for POS dropdown once
  useEffect(() => {
    ProductService.getAll().then(data => setPosProducts(data || [])).catch(() => {});
  }, []);

  // 🔌 Socket.IO Real-Time Listeners
  useEffect(() => {
    const socket = getSocket();

    const handleNewOrder = (newOrder) => {
      setOrders(prev => [newOrder, ...prev.filter(o => o._id !== newOrder._id)]);
      setLiveAlert(`🔔 New Order ${newOrder.orderId} from ${newOrder.customerName || 'Walk-In'}`);
      // Play notification sound
      try { new Audio('data:audio/wav;base64,UklGRl9vT19teleYXNzZXQ=').play().catch(() => {}); } catch {}
      setTimeout(() => setLiveAlert(null), 5000);
    };

    const handleStatusUpdated = (data) => {
      setOrders(prev => prev.map(o =>
        (o._id === data._id || o.orderId === data.orderId) 
          ? { ...o, status: data.status, cancelReason: data.cancelReason } 
          : o
      ));
    };

    socket.on('new-order', handleNewOrder);
    socket.on('order-status-updated', handleStatusUpdated);

    return () => {
      socket.off('new-order', handleNewOrder);
      socket.off('order-status-updated', handleStatusUpdated);
    };
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await OrderService.updateStatus(orderId, newStatus);
      loadOrders();
    } catch (error) {
      alert('Failed to update order status: ' + error.message);
    }
  };

  const handleCreatePosOrder = async (e) => {
    e.preventDefault();
    setPosSubmitting(true);
    try {
      const newOrder = await OrderService.create({
        customerName: posCustomerName || 'Walk-In Counter Customer',
        customerPhone: posCustomerPhone || '0300-0000000',
        customerAddress: posOrderType === 'Delivery' ? 'Timergara City' : 'Timergara Counter Pickup',
        orderType: posOrderType,
        branch: 'Timergara Main Branch',
        items: [{
          name: posItemName,
          price: Number(posPrice) || 500,
          quantity: Number(posQuantity) || 1,
          selectedOption: posOption
        }],
        totalAmount: (Number(posPrice) || 500) * (Number(posQuantity) || 1),
        paymentMethod: 'Cash on Delivery',
        status: 'Pending'
      });
      setIsPosOpen(false);
      setPosCustomerName('');
      setPosCustomerPhone('');
      setSelectedReceipt(newOrder);
      loadOrders();
    } catch (err) {
      alert('Failed to record counter order: ' + err.message);
    } finally {
      setPosSubmitting(false);
    }
  };

  const statuses = ['All', 'Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

  return (
    <div className="min-h-screen bg-[#0d0d11] text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* 🔌 Real-Time Live Alert Toast */}
        {liveAlert && (
          <div className="animate-pulse bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 px-5 py-3 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-lg shadow-emerald-500/10">
            <FiWifi className="text-emerald-400 text-lg animate-bounce" />
            <span>{liveAlert}</span>
            <button onClick={() => setLiveAlert(null)} className="ml-auto text-emerald-400 hover:text-white">
              <FiX />
            </button>
          </div>
        )}
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-6">
          <div>
            <Link to="/admin/dashboard" className="text-xs text-amber-400 hover:underline">
              ← Back to Dashboard Overview
            </Link>
            <h1 className="text-3xl font-bold font-serif gold-gradient-text mt-1">
              Receptionist & Counter Order Desk
            </h1>
            <p className="text-xs text-gray-400">Manage live customer orders, record counter sales, and print invoices</p>
          </div>

          <button
            onClick={() => setIsPosOpen(true)}
            className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-lg shadow-amber-500/20"
          >
            <FiPlus className="text-base" /> New Counter POS Order
          </button>
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
                      <td className="py-4 px-3 font-mono font-bold text-amber-400">
                        #{ord.orderId}
                        {ord.isCustomCake && (
                          <span className="block text-[9px] font-sans font-black uppercase text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40 mt-1">
                            🎂 Custom Cake
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-3">
                        <div className="font-bold text-white">{ord.customerName}</div>
                        <div className="text-[11px] text-amber-300/80 font-mono">{ord.customerPhone}</div>
                      </td>
                      <td className="py-4 px-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                          ord.orderType === 'Delivery'
                            ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                            : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                        }`}>
                          {ord.orderType === 'Delivery' ? '🛵 Home Delivery' : '🏪 Counter Pickup'}
                        </span>
                        <span className="text-[10px] text-gray-400 block mt-1 line-clamp-2 leading-tight">
                          {ord.orderType === 'Delivery' ? (
                            <>📍 <strong className="text-gray-300">Deliver To:</strong> {ord.customerAddress}</>
                          ) : (
                            <span className="text-purple-300/80 font-medium">Customer will pick up from counter</span>
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <div className="space-y-1">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="text-[11px] text-gray-300">
                              • <span className="font-semibold text-white">{it.name}</span> ({it.selectedOption}) x {it.quantity}
                            </div>
                          ))}

                          {ord.isCustomCake && (
                            <div className="mt-2 bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl space-y-2 text-[11px]">
                              <div className="text-amber-400 font-bold text-xs flex items-center justify-between border-b border-amber-500/20 pb-1">
                                <span>🎂 Custom Cake Specifications</span>
                                <span className="text-[9px] uppercase tracking-wider bg-amber-500/20 px-2 py-0.5 rounded-full text-amber-300">Kitchen Spec</span>
                              </div>

                              {ord.customCakeDetails && (
                                <div className="space-y-1">
                                  <div>🍰 <strong>Flavor:</strong> {ord.customCakeDetails.flavor || 'Standard'}</div>
                                  <div>⚖️ <strong>Weight:</strong> {ord.customCakeDetails.weight || '1 Lb'}</div>
                                  <div>📐 <strong>Shape:</strong> {ord.customCakeDetails.shape || 'Round'}</div>
                                  <div>✍️ <strong>Topping Text:</strong> <span className="font-serif italic text-amber-300 font-bold">"{ord.customCakeDetails.toppingMessage || 'No text requested'}"</span></div>
                                </div>
                              )}

                              {/* Special Customer Notes & Design Vision */}
                              {(ord.notes || ord.customCakeDetails?.specialInstructions) && (
                                <div className="bg-amber-500/20 border border-amber-500/40 p-2 rounded-lg text-amber-200 font-semibold space-y-1">
                                  <div className="text-[10px] uppercase font-black tracking-wider text-amber-400">📝 Special Design Vision & Customer Notes:</div>
                                  {ord.customCakeDetails?.specialInstructions && (
                                    <div>• <strong>Custom Cake Vision:</strong> {ord.customCakeDetails.specialInstructions}</div>
                                  )}
                                  {ord.notes && ord.notes !== ord.customCakeDetails?.specialInstructions && (
                                    <div>• <strong>Order Checkout Note:</strong> {ord.notes}</div>
                                  )}
                                </div>
                              )}

                              {/* Custom Reference Photo Image Preview */}
                              {(() => {
                                const refPhoto = ord.customCakeDetails?.referencePhotoUrl || ord.items?.find(i => i.imageUrl && i.imageUrl.length > 50)?.imageUrl;
                                if (!refPhoto) return null;
                                return (
                                  <div className="pt-2 border-t border-amber-500/20">
                                    <div className="text-[10px] font-bold text-amber-300 mb-1.5 flex items-center gap-1">
                                      <FiCamera className="text-amber-400 text-xs" /> Customer Reference Photo Attachment:
                                    </div>
                                    <div className="relative group inline-block">
                                      <img 
                                        src={refPhoto} 
                                        alt="Custom Cake Reference" 
                                        onClick={() => setZoomedImageModal(refPhoto)}
                                        className="w-28 h-28 object-cover rounded-xl border-2 border-amber-500/50 shadow-lg cursor-pointer group-hover:scale-105 transition"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setZoomedImageModal(refPhoto)}
                                        className="absolute bottom-1 right-1 bg-black/80 hover:bg-amber-500 hover:text-slate-950 text-amber-300 px-2 py-0.5 rounded-lg text-[9px] font-bold flex items-center gap-1 shadow transition"
                                      >
                                        <FiMaximize2 /> Zoom Photo
                                      </button>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          )}
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
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedReceipt(ord)}
                            className="px-3 py-1.5 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 rounded-lg text-[11px] font-bold inline-flex items-center gap-1.5 transition"
                          >
                            <FiPrinter /> Receipt
                          </button>
                          <a
                            href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Salam ${ord.customerName}! Update on your order #${ord.orderId} from Halwiyat Zamzam Bakers Timergara:\n\n` +
                              `📌 *Status*: *${ord.status.toUpperCase()}*\n` +
                              `💳 *Total*: Rs. ${ord.totalAmount}\n` +
                              `📍 *Type*: ${ord.orderType}\n\n` +
                              (ord.status === 'Ready' ? '🎉 Your order is READY for pickup/delivery! Thank you!' : 'Thank you for choosing Halwiyat Zamzam Bakers!')
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1.5 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/30 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 border border-emerald-500/30 transition"
                            title="Send WhatsApp update to customer"
                          >
                            <FaWhatsapp className="text-xs" /> Notify
                          </a>
                          {ord.status !== 'Delivered' && ord.status !== 'Cancelled' && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Cancel order #${ord.orderId} for ${ord.customerName}?`)) {
                                  handleUpdateStatus(ord._id, 'Cancelled');
                                }
                              }}
                              className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-[11px] font-bold inline-flex items-center gap-1.5 border border-red-500/20 transition"
                              title="Cancel this order"
                            >
                              <FiSlash /> Cancel
                            </button>
                          )}
                        </div>
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
            <div className="printable-receipt bg-[#181820] border border-amber-500/30 rounded-3xl p-6 max-w-md w-full space-y-6 text-white">
              
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
                  <p>Address: {selectedReceipt.customerAddress}</p>
                </div>

                <div className="border-t border-b border-dashed border-white/20 py-3 space-y-2">
                  {selectedReceipt.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{it.quantity}x {it.name} ({it.selectedOption})</span>
                      <span>Rs. {it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>

                {selectedReceipt.isCustomCake && selectedReceipt.customCakeDetails && (
                  <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl space-y-1 font-sans">
                    <div className="font-black text-amber-300 text-[11px] uppercase border-b border-amber-500/20 pb-1 mb-1">
                      🎂 Pastry Chef Kitchen Specs
                    </div>
                    <div>🍰 <strong>Flavor:</strong> {selectedReceipt.customCakeDetails.flavor}</div>
                    <div>⚖️ <strong>Weight:</strong> {selectedReceipt.customCakeDetails.weight}</div>
                    <div>📐 <strong>Shape:</strong> {selectedReceipt.customCakeDetails.shape}</div>
                    <div>✍️ <strong>Text on Cake:</strong> "{selectedReceipt.customCakeDetails.toppingMessage}"</div>
                    {(selectedReceipt.notes || selectedReceipt.customCakeDetails.specialInstructions) && (
                      <div className="text-amber-200 mt-1 pt-1 border-t border-amber-500/20 font-bold">
                        📝 <strong>Customer Notes:</strong> {selectedReceipt.customCakeDetails.specialInstructions || selectedReceipt.notes}
                      </div>
                    )}
                    {(selectedReceipt.customCakeDetails.referencePhotoUrl || selectedReceipt.items?.find(i => i.imageUrl && i.imageUrl.length > 50)?.imageUrl) && (
                      <div className="mt-2 pt-1 border-t border-amber-500/20">
                        <div className="text-[10px] font-bold text-amber-300 mb-1">📸 Reference Photo Attached:</div>
                        <img 
                          src={selectedReceipt.customCakeDetails.referencePhotoUrl || selectedReceipt.items?.find(i => i.imageUrl && i.imageUrl.length > 50)?.imageUrl} 
                          alt="Cake Photo Reference" 
                          className="w-20 h-20 object-cover rounded-lg border border-amber-500/40"
                        />
                      </div>
                    )}
                  </div>
                )}

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

        {/* Counter POS Order Modal */}
        {isPosOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#181820] border border-amber-500/30 rounded-3xl p-6 max-w-lg w-full space-y-6 text-white shadow-2xl">
              <div className="flex justify-between items-center border-b border-amber-500/20 pb-4">
                <div>
                  <h3 className="text-xl font-bold font-serif gold-gradient-text flex items-center gap-2">
                    <FiPlus className="text-amber-400" /> New Counter POS Order
                  </h3>
                  <p className="text-[11px] text-gray-400">Record a phone or walk-in customer order directly from the counter</p>
                </div>
                <button onClick={() => setIsPosOpen(false)} className="text-gray-400 hover:text-white">
                  <FiX className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleCreatePosOrder} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1 font-bold">Customer Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Walk-In Customer"
                      value={posCustomerName}
                      onChange={(e) => setPosCustomerName(e.target.value)}
                      className="w-full bg-[#121216] border border-amber-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 font-bold">Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 0345-9000123"
                      value={posCustomerPhone}
                      onChange={(e) => setPosCustomerPhone(e.target.value)}
                      className="w-full bg-[#121216] border border-amber-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1 font-bold">Order Type</label>
                    <select
                      value={posOrderType}
                      onChange={(e) => setPosOrderType(e.target.value)}
                      className="w-full bg-[#121216] border border-amber-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 font-bold"
                    >
                      <option value="Pickup">Counter Pickup</option>
                      <option value="Delivery">Home Delivery</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 font-bold">Select Product</label>
                    <select
                      value={posItemName}
                      onChange={(e) => {
                        const selected = posProducts.find(p => p.name === e.target.value);
                        setPosItemName(e.target.value);
                        if (selected) {
                          setPosPrice(selected.price.toString());
                          setPosOption(selected.weightOptions?.[0] || '1 Pcs');
                        }
                      }}
                      className="w-full bg-[#121216] border border-amber-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 font-bold"
                      required
                    >
                      <option value="">-- Select Product --</option>
                      {posProducts.map(p => (
                        <option key={p._id} value={p.name}>
                          {p.name} — Rs. {p.price}
                        </option>
                      ))}
                      <option value="Custom Item">➕ Custom / Other Item</option>
                    </select>
                    {posItemName === 'Custom Item' && (
                      <input
                        type="text"
                        placeholder="Enter custom item name..."
                        onChange={(e) => setPosItemName(e.target.value === 'Custom Item' ? '' : e.target.value)}
                        className="w-full bg-[#121216] border border-amber-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 mt-2"
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1 font-bold">Portion / Option</label>
                    <input
                      type="text"
                      placeholder="e.g. 1 Kg / Medium"
                      value={posOption}
                      onChange={(e) => setPosOption(e.target.value)}
                      className="w-full bg-[#121216] border border-amber-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 font-bold">Unit Price (PKR)</label>
                    <input
                      type="number"
                      placeholder="850"
                      value={posPrice}
                      onChange={(e) => setPosPrice(e.target.value)}
                      className="w-full bg-[#121216] border border-amber-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 font-mono font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 font-bold">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={posQuantity}
                      onChange={(e) => setPosQuantity(e.target.value)}
                      className="w-full bg-[#121216] border border-amber-500/20 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex justify-between items-center text-sm font-bold text-amber-300">
                  <span>TOTAL BILLABLE AMOUNT:</span>
                  <span className="font-mono text-lg text-amber-400">
                    Rs. {(Number(posPrice) || 0) * (Number(posQuantity) || 1)}
                  </span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPosOpen(false)}
                    className="flex-1 py-3 bg-[#121216] text-gray-400 font-bold rounded-xl hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={posSubmitting}
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
                  >
                    {posSubmitting ? 'Recording...' : 'Submit & Print Receipt'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Full-Screen Custom Cake Photo Zoom Modal */}
        {zoomedImageModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full bg-[#14141a] border border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-amber-500/20 pb-3">
                <h3 className="text-base font-bold font-serif text-amber-400 flex items-center gap-2">
                  <FiCamera className="text-amber-400" />
                  Custom Cake Design Reference Photo (High Resolution)
                </h3>
                <button
                  type="button"
                  onClick={() => setZoomedImageModal(null)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              <div className="max-h-[75vh] overflow-auto flex items-center justify-center bg-black/60 rounded-2xl p-2 border border-amber-500/20">
                <img 
                  src={zoomedImageModal} 
                  alt="Custom Cake High Resolution Zoom" 
                  className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
                />
              </div>

              <div className="flex justify-between items-center pt-2 text-xs">
                <span className="text-gray-400 font-mono">
                  Timergara Pastry Chef Inspection Console
                </span>
                <button
                  type="button"
                  onClick={() => setZoomedImageModal(null)}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
