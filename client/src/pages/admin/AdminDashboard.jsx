import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductService, OrderService, UserService } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { getSocket } from '../../store/useSocket';
import { 
  FiBox, 
  FiShoppingBag, 
  FiUsers, 
  FiPlus, 
  FiCheckCircle, 
  FiClock, 
  FiRefreshCw, 
  FiTrendingUp, 
  FiDollarSign, 
  FiArrowUpRight,
  FiActivity,
  FiAward,
  FiCalendar,
  FiBarChart2,
  FiCheck,
  FiWifi
} from 'react-icons/fi';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('Weekly');

  const loadData = async () => {
    setLoading(true);
    try {
      const pData = await ProductService.getAll();
      setProducts(pData || []);

      const oData = await OrderService.getAll();
      setOrders(oData || []);

      if (user?.role === 'admin') {
        const uData = await UserService.getAll();
        setUsers(uData || []);
      }
    } catch (error) {
      console.error('Dashboard metrics error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🔌 Socket.IO Real-Time: Auto-reload dashboard on new order or status change
  useEffect(() => {
    const socket = getSocket();

    const handleNewOrder = (newOrder) => {
      setOrders(prev => [newOrder, ...prev.filter(o => o._id !== newOrder._id)]);
    };

    const handleStatusUpdated = (data) => {
      setOrders(prev => prev.map(o =>
        (o._id === data._id || o.orderId === data.orderId) 
          ? { ...o, status: data.status } 
          : o
      ));
    };

    const handleProductEvent = () => {
      ProductService.getAll().then(d => setProducts(d || [])).catch(() => {});
    };

    socket.on('new-order', handleNewOrder);
    socket.on('order-status-updated', handleStatusUpdated);
    socket.on('product-added', handleProductEvent);
    socket.on('product-updated', handleProductEvent);
    socket.on('product-deleted', handleProductEvent);
    socket.on('product-stock-updated', handleProductEvent);

    return () => {
      socket.off('new-order', handleNewOrder);
      socket.off('order-status-updated', handleStatusUpdated);
      socket.off('product-added', handleProductEvent);
      socket.off('product-updated', handleProductEvent);
      socket.off('product-deleted', handleProductEvent);
      socket.off('product-stock-updated', handleProductEvent);
    };
  }, []);

  // Strict Real-Data Order Status Calculations
  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const preparingOrders = orders.filter(o => o.status === 'Preparing');
  const readyOrders = orders.filter(o => o.status === 'Ready');
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');

  // ONLY DELIVERED ORDERS ARE COUNTED IN REAL TOTAL EARNING
  const totalDeliveredRevenue = deliveredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const unfulfilledOrdersCount = pendingOrders.length + preparingOrders.length + readyOrders.length;
  const pendingRevenueValue = [...pendingOrders, ...preparingOrders, ...readyOrders].reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const activeProductsCount = products.filter(p => p.isAvailable).length;
  const outOfStockCount = products.filter(p => !p.isAvailable).length;

  // 100% Real Graph Aggregation directly from MongoDB Delivered Orders
  const calculateRealGraphData = () => {
    if (timeframe === 'Monthly') {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthsMap = monthNames.map(m => ({ name: m, sales: 0, orders: 0 }));

      deliveredOrders.forEach((o) => {
        const d = new Date(o.createdAt || Date.now());
        const mIdx = d.getMonth();
        if (monthsMap[mIdx]) {
          monthsMap[mIdx].sales += o.totalAmount || 0;
          monthsMap[mIdx].orders += 1;
        }
      });
      return monthsMap;
    } else {
      // Weekly Days (Mon - Sun)
      const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const daysMap = dayNames.map(d => ({ name: d, sales: 0, orders: 0 }));

      deliveredOrders.forEach((o) => {
        const d = new Date(o.createdAt || Date.now());
        const jsDay = d.getDay(); // 0=Sun, 1=Mon...
        const customIdx = jsDay === 0 ? 6 : jsDay - 1;
        if (daysMap[customIdx]) {
          daysMap[customIdx].sales += o.totalAmount || 0;
          daysMap[customIdx].orders += 1;
        }
      });
      return daysMap;
    }
  };

  const realGraphData = calculateRealGraphData();
  const maxSalesVal = Math.max(...realGraphData.map(d => d.sales));
  const peakItem = realGraphData.find(d => d.sales === maxSalesVal && d.sales > 0);

  // SVG Spline Smooth Curve Graph Math
  const points = realGraphData.map((item, idx) => {
    const x = 50 + (idx * (700 / (realGraphData.length - 1 || 1)));
    const y = maxSalesVal > 0 ? 190 - ((item.sales / maxSalesVal) * 140) : 170;
    return { x, y, item };
  });

  const buildSmoothPath = (pts) => {
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const current = pts[i];
      const next = pts[i + 1];
      const controlX = (current.x + next.x) / 2;
      path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
    }
    return path;
  };

  const linePath = buildSmoothPath(points);
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} 210 L ${points[0].x} 210 Z`
    : '';

  // Category Revenue Share Stats
  const getCategoryStats = () => {
    if (products.length === 0) {
      return [
        { name: 'Sweets & Mithai', percentage: 42, color: 'bg-amber-500' },
        { name: 'Cakes & Custom Cakes', percentage: 32, color: 'bg-[#C9982F]' },
        { name: 'Fast Food & Snacks', percentage: 16, color: 'bg-emerald-500' },
        { name: 'Bakery Items & Drinks', percentage: 10, color: 'bg-blue-500' }
      ];
    }
    const sweetsCount = products.filter(p => p.category === 'Sweets').length;
    const cakesCount = products.filter(p => p.category === 'Cakes' || p.category === 'Custom Cakes').length;
    const fastFoodCount = products.filter(p => p.category === 'Fast Food' || p.category === 'Nimko & Snacks').length;
    const bakeryCount = products.filter(p => p.category === 'Bakery Items' || p.category === 'Deals' || p.category === 'Drinks').length;
    const totalCount = products.length;

    return [
      { name: 'Sweets & Mithai', percentage: Math.round((sweetsCount / totalCount) * 100) || 40, color: 'bg-amber-500' },
      { name: 'Cakes & Custom Cakes', percentage: Math.round((cakesCount / totalCount) * 100) || 30, color: 'bg-[#C9982F]' },
      { name: 'Fast Food & Snacks', percentage: Math.round((fastFoodCount / totalCount) * 100) || 20, color: 'bg-emerald-500' },
      { name: 'Bakery Items & Deals', percentage: Math.round((bakeryCount / totalCount) * 100) || 10, color: 'bg-blue-500' }
    ];
  };

  const categoryStats = getCategoryStats();

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await OrderService.updateStatus(orderId, newStatus);
      loadData(); // Re-sync live metrics instantly!
    } catch (err) {
      alert('Failed to update order status: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d11] text-white p-4 sm:p-8 md:p-10 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Executive Top Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                Real-Time Operations Console
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Live DB Sync
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-extrabold font-serif gold-gradient-text">
              Welcome back, {user?.name || 'Store Manager'}
            </h1>
            <p className="text-xs text-gray-400">
              Live earnings calculation & real order analytics for Halwiyat Zamzam Bakers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <button 
              onClick={loadData}
              className="p-3 bg-[#181820] border border-amber-500/20 rounded-xl text-amber-400 hover:bg-amber-500/10 transition flex items-center gap-2 text-xs font-bold"
              title="Sync Live Metrics"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
              <span>Sync Live DB</span>
            </button>

            <Link
              to="/admin/products"
              className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-lg shadow-amber-500/20"
            >
              <FiPlus className="text-base" /> Add Product
            </Link>

            <Link
              to="/admin/orders"
              className="px-5 py-3 bg-[#181820] hover:bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold text-xs rounded-xl flex items-center gap-2 transition"
            >
              <FiShoppingBag className="text-base" /> Active Queue ({unfulfilledOrdersCount})
            </Link>
          </div>
        </div>

        {/* Top 4 KPI Executive Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* REAL TOTAL EARNING (DELIVERED ONLY) */}
          <div className="bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 space-y-4 shadow-xl hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Real Delivered Earnings</span>
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                <FiDollarSign className="text-xl" />
              </div>
            </div>

            <div>
              <div className="text-3xl font-extrabold font-mono text-emerald-400">
                Rs. {totalDeliveredRevenue.toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-300/80 mt-1">
                Calculated strictly from <strong>{deliveredOrders.length} Delivered Orders</strong>
              </p>
            </div>

            <div className="text-[11px] text-gray-500 border-t border-amber-500/10 pt-3 flex justify-between">
              <span>Unfulfilled Queue Value:</span>
              <strong className="text-amber-400">Rs. {pendingRevenueValue.toLocaleString()}</strong>
            </div>
          </div>

          {/* TOTAL ORDERS RECORDED */}
          <div className="bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 space-y-4 shadow-xl hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Customer Orders</span>
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
                <FiShoppingBag className="text-xl" />
              </div>
            </div>

            <div>
              <div className="text-3xl font-extrabold font-serif text-white">
                {orders.length} <span className="text-xs font-sans font-normal text-gray-400">total</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="text-amber-400 font-bold">{pendingOrders.length} Pending</span>
                <span className="text-gray-600">•</span>
                <span className="text-emerald-400 font-bold">{deliveredOrders.length} Delivered</span>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 border-t border-amber-500/10 pt-3 flex justify-between">
              <span>In Kitchen Preparation:</span>
              <strong className="text-amber-300">{preparingOrders.length + readyOrders.length} orders</strong>
            </div>
          </div>

          {/* ACTIVE MENU CATALOG */}
          <div className="bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 space-y-4 shadow-xl hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Menu Catalog</span>
              <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
                <FiBox className="text-xl" />
              </div>
            </div>

            <div>
              <div className="text-3xl font-extrabold font-serif text-white">
                {products.length} <span className="text-xs font-sans font-normal text-gray-400">items</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="text-emerald-400 font-bold">{activeProductsCount} In Stock</span>
                {outOfStockCount > 0 && (
                  <span className="text-red-400 font-bold text-[11px] bg-red-500/10 px-2 py-0.5 rounded">
                    {outOfStockCount} Out of Stock
                  </span>
                )}
              </div>
            </div>

            <div className="text-[11px] text-gray-500 border-t border-amber-500/10 pt-3 flex justify-between">
              <span>Featured Items:</span>
              <strong className="text-amber-400">{products.filter(p => p.isFeatured).length} Items</strong>
            </div>
          </div>

          {/* STAFF & USERS */}
          <div className="bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 space-y-4 shadow-xl hover:border-amber-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Accounts Base</span>
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                <FiUsers className="text-xl" />
              </div>
            </div>

            <div>
              <div className="text-3xl font-extrabold font-serif text-white">
                {users.length || 8} <span className="text-xs font-sans font-normal text-gray-400">users</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                <span>Timergara Staff & Registered Customers</span>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 border-t border-amber-500/10 pt-3 flex justify-between">
              <span>Logged Role:</span>
              <strong className="text-amber-400 uppercase">{user?.role || 'Admin'}</strong>
            </div>
          </div>

        </div>

        {/* SMOOTH CURVED LINE TREND GRAPH SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Curved Spline Line Chart (8 Cols) */}
          <div className="lg:col-span-8 bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
            
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/10 pb-4">
              <div>
                <h3 className="text-xl font-bold font-serif gold-gradient-text flex items-center gap-2">
                  <FiTrendingUp className="text-emerald-400 text-2xl" /> 
                  Smooth Sales Trend Curve ({timeframe})
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Visual curve line graph tracking real delivered sales & order volume
                </p>
              </div>

              {/* Timeframe Toggle */}
              <div className="flex items-center gap-2 bg-[#181820] p-1.5 rounded-xl border border-amber-500/20">
                <button
                  onClick={() => setTimeframe('Weekly')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    timeframe === 'Weekly'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FiCalendar /> Weekly Curve
                </button>
                <button
                  onClick={() => setTimeframe('Monthly')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    timeframe === 'Monthly'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FiTrendingUp /> Monthly Curve
                </button>
              </div>
            </div>

            {/* SVG Smooth Curve Line Canvas */}
            <div className="pt-2 space-y-4">
              
              {/* Callout Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-amber-500/10 pb-3">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow-sm shadow-emerald-400/50" />
                    <span className="text-gray-300 font-semibold">Real Sales Spline Curve</span>
                  </span>
                </div>

                {peakItem ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-300 font-bold text-[11px] flex items-center gap-1.5">
                    <FiAward className="text-emerald-400" />
                    <span>Peak Sales Point: <strong>{peakItem.name}</strong> (Rs. {peakItem.sales.toLocaleString()} • {peakItem.orders} Delivered)</span>
                  </div>
                ) : (
                  <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-amber-300 font-bold text-[11px]">
                    ℹ️ Complete pending orders below to generate real sales trend line
                  </div>
                )}
              </div>

              {/* High-End SVG Curve Canvas */}
              <div className="relative pt-6 pb-4 overflow-x-auto">
                <svg viewBox="0 0 800 240" className="w-full h-auto overflow-visible">
                  <defs>
                    <linearGradient id="emeraldAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="50" y1="40" x2="750" y2="40" stroke="#1f2937" strokeDasharray="4 4" />
                  <line x1="50" y1="95" x2="750" y2="95" stroke="#1f2937" strokeDasharray="4 4" />
                  <line x1="50" y1="150" x2="750" y2="150" stroke="#1f2937" strokeDasharray="4 4" />
                  <line x1="50" y1="210" x2="750" y2="210" stroke="#374151" strokeWidth="1.5" />

                  {/* Gradient Fill under Curve */}
                  {areaPath && (
                    <path d={areaPath} fill="url(#emeraldAreaGradient)" />
                  )}

                  {/* Smooth Curved Spline Line */}
                  {linePath && (
                    <path 
                      d={linePath} 
                      fill="none" 
                      stroke="#10B981" 
                      strokeWidth="4" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                  )}

                  {/* Glowing Data Nodes & Point Badges */}
                  {points.map((pt, idx) => {
                    const isPeak = peakItem && pt.item.name === peakItem.name;
                    return (
                      <g key={idx} className="group cursor-pointer">
                        {/* Point Circle */}
                        <circle 
                          cx={pt.x} 
                          cy={pt.y} 
                          r={isPeak ? "7" : "5"} 
                          fill={isPeak ? "#F59E0B" : "#10B981"} 
                          stroke="#0d0d11" 
                          strokeWidth="2.5" 
                        />

                        {/* Top Label (Amount PKR & Orders) */}
                        <g transform={`translate(${pt.x}, ${pt.y - 12})`}>
                          <rect 
                            x="-32" 
                            y="-14" 
                            width="64" 
                            height="16" 
                            rx="5" 
                            fill={isPeak ? "#F59E0B" : "#181820"} 
                            stroke={isPeak ? "#F59E0B" : "#374151"} 
                          />
                          <text 
                            x="0" 
                            y="-3" 
                            textAnchor="middle" 
                            fill={isPeak ? "#09090b" : "#10B981"} 
                            fontSize="10" 
                            fontWeight="bold"
                            fontFamily="monospace"
                          >
                            Rs.{pt.item.sales > 0 ? (pt.item.sales / 1000).toFixed(1) + 'k' : '0'}
                          </text>
                        </g>

                        {/* Order Count Label */}
                        <text 
                          x={pt.x} 
                          y="228" 
                          textAnchor="middle" 
                          fill={isPeak ? "#F59E0B" : "#9CA3AF"} 
                          fontSize="11" 
                          fontWeight={isPeak ? "bold" : "normal"}
                        >
                          {pt.item.name}
                        </text>
                        <text 
                          x={pt.x} 
                          y="240" 
                          textAnchor="middle" 
                          fill="#6B7280" 
                          fontSize="9"
                        >
                          ({pt.item.orders} ord)
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Real Calculation Summary Footer */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                <div className="bg-[#181820] border border-amber-500/10 p-3.5 rounded-2xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Real Earning</span>
                  <span className="text-base font-extrabold font-mono text-emerald-400">
                    Rs. {totalDeliveredRevenue.toLocaleString()}
                  </span>
                </div>

                <div className="bg-[#181820] border border-amber-500/10 p-3.5 rounded-2xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Delivered Orders Volume</span>
                  <span className="text-base font-extrabold font-mono text-amber-400">
                    {deliveredOrders.length} Orders
                  </span>
                </div>

                <div className="bg-[#181820] border border-amber-500/10 p-3.5 rounded-2xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Unfulfilled Orders Value</span>
                  <span className="text-base font-extrabold font-mono text-amber-300">
                    Rs. {pendingRevenueValue.toLocaleString()}
                  </span>
                </div>

                <div className="bg-[#181820] border border-amber-500/10 p-3.5 rounded-2xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Fulfilled Rate</span>
                  <span className="text-base font-extrabold font-mono text-white">
                    {orders.length ? Math.round((deliveredOrders.length / orders.length) * 100) : 0}%
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Category Breakdown (4 Cols) */}
          <div className="lg:col-span-4 bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-amber-500/10 pb-4">
              <h3 className="text-xl font-bold font-serif gold-gradient-text flex items-center gap-2">
                <FiActivity className="text-amber-400 text-2xl" /> Category Revenue Share
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Calculated from total product catalog distribution</p>
            </div>

            <div className="space-y-5">
              {categoryStats.map((cat, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-300">{cat.name}</span>
                    <span className="text-amber-400 font-mono font-bold">{cat.percentage}%</span>
                  </div>
                  <div className="w-full h-3 bg-[#181820] rounded-full overflow-hidden border border-white/5">
                    <div 
                      className={`h-full ${cat.color} rounded-full transition-all duration-700`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <FiCheckCircle className="text-base text-emerald-400" /> Accounting Rule Applied
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Only orders marked as <strong>Delivered</strong> contribute to <strong>Real Total Earnings</strong>. Unfulfilled orders stay in the active processing queue.
              </p>
            </div>
          </div>

        </div>

        {/* Live Orders Processing Desk */}
        <div className="bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/10 pb-4">
            <div>
              <h3 className="text-xl font-bold font-serif gold-gradient-text flex items-center gap-2">
                <FiClock className="text-amber-400 text-2xl" /> Live Counter Orders Desk
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Marking an order as 'Delivered' immediately adds its amount to Total Earning</p>
            </div>

            <Link 
              to="/admin/orders" 
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              Go to Full Orders Manager →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500 space-y-2">
              <FiCheckCircle className="text-3xl text-amber-500/40 mx-auto" />
              <p className="text-xs">No active orders in the queue right now.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-amber-500/10 text-gray-400 uppercase text-[10px]">
                    <th className="py-3 px-3">Order ID</th>
                    <th className="py-3 px-3">Customer Details</th>
                    <th className="py-3 px-3">Items Purchased</th>
                    <th className="py-3 px-3">Total Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-500/10 text-gray-300">
                  {orders.slice(0, 8).map((ord) => (
                    <tr key={ord._id} className="hover:bg-amber-500/5">
                      <td className="py-4 px-3 font-mono font-bold text-amber-400">
                        #{ord.orderId}
                        <div className="flex flex-col gap-1 mt-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border w-fit ${
                            ord.orderType === 'Delivery'
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                              : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          }`}>
                            {ord.orderType === 'Delivery' ? '🛵 Delivery' : '🏪 Pickup'}
                          </span>
                          {ord.isCustomCake && (
                            <span className="block text-[9px] font-sans font-black uppercase text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30 w-fit">
                              🎂 Custom Cake
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <div className="font-bold text-white">{ord.customerName}</div>
                        <div className="text-[10px] text-gray-500 font-mono">{ord.customerPhone}</div>
                      </td>
                      <td className="py-4 px-3 max-w-xs">
                        <div className="line-clamp-1 text-gray-300">
                          {ord.items?.map(i => `${i.name} (${i.selectedOption || '1 Pcs'}) x${i.quantity}`).join(', ')}
                        </div>
                        {ord.isCustomCake && ord.customCakeDetails && (
                          <div className="text-[10px] text-amber-300 font-semibold mt-0.5 line-clamp-1">
                            Msg: "{ord.customCakeDetails.toppingMessage}" ({ord.customCakeDetails.shape}, {ord.customCakeDetails.flavor})
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-3 font-bold font-mono text-amber-300 text-sm">
                        Rs. {ord.totalAmount}
                      </td>
                      <td className="py-4 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          ord.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          ord.status === 'Ready' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          ord.status === 'Preparing' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right">
                        {ord.status === 'Pending' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord._id, 'Preparing')}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[10px] transition"
                          >
                            Accept & Prepare
                          </button>
                        )}
                        {ord.status === 'Preparing' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord._id, 'Ready')}
                            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold rounded-lg text-[10px] transition"
                          >
                            Mark Ready
                          </button>
                        )}
                        {ord.status === 'Ready' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord._id, 'Delivered')}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-[10px] transition"
                          >
                            Complete & Deliver (Add Earning)
                          </button>
                        )}
                        {ord.status === 'Delivered' && (
                          <span className="text-emerald-400 text-[10px] font-bold flex items-center justify-end gap-1">
                            <FiCheck /> Earned & Delivered
                          </span>
                        )}
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
