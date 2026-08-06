import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { OrderService } from '../services/api';
import { FiCreditCard, FiTruck, FiCheckCircle, FiShield, FiLock, FiPhone, FiMapPin, FiUser, FiShoppingBag, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { FaWhatsapp, FaUniversity } from 'react-icons/fa';
import { isValidPakistaniPhone } from '../utils/validation';

export default function Checkout() {
  const { cart, getSubtotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Form Fields
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerAddress, setCustomerAddress] = useState(user?.address || '');
  const [orderType, setOrderType] = useState('Delivery');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [notes, setNotes] = useState('');

  // Online Card State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [loading, setLoading] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  // Sync user profile data if user logs in
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerPhone) setCustomerPhone(user.phone || '');
      if (!customerAddress) setCustomerAddress(user.address || '');
    }
  }, [user]);

  const subtotal = getSubtotal();
  const deliveryFee = orderType === 'Delivery' ? 150 : 0;
  const totalAmount = subtotal + deliveryFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Mandatory Authentication Check
    if (!user) {
      alert('Please Sign In or Register an account first to complete your checkout!');
      navigate('/login?redirect=/checkout');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    if (!customerName || !customerPhone) {
      alert('Please fill in your Name and Phone Number');
      return;
    }

    if (!isValidPakistaniPhone(customerPhone)) {
      alert('Please enter a valid Pakistani mobile number (e.g. 03275001166 or 03001234567)');
      return;
    }

    if (orderType === 'Delivery' && !customerAddress) {
      alert('Please enter your Delivery Address in Timergara');
      return;
    }

    setLoading(true);

    try {
      const customCakeItem = cart.find(i => i.isCustomCake || i._id?.toString().startsWith('custom-cake'));
      const isCustomCakeOrder = !!customCakeItem;

      const orderPayload = {
        customerName,
        customerPhone,
        customerEmail: user?.email || '',
        customerAddress: orderType === 'Delivery' ? customerAddress : 'Pickup from Timergara Main Branch Counter',
        orderType,
        branch: 'Timergara Main Branch',
        items: cart.map(i => {
          const isCustom = i.isCustomCake || i._id?.toString().startsWith('custom-cake');
          return {
            product: isCustom ? null : i._id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            selectedOption: i.selectedOption || (isCustom ? 'Custom Specs' : ''),
            imageUrl: i.imageUrl || ''
          };
        }),
        totalAmount,
        paymentMethod,
        notes: notes || (customCakeItem?.customCakeDetails?.specialInstructions ? `Cake Note: ${customCakeItem.customCakeDetails.specialInstructions}` : ''),
        isCustomCake: isCustomCakeOrder,
        customCakeDetails: customCakeItem ? (customCakeItem.customCakeDetails || {
          flavor: customCakeItem.name,
          weight: customCakeItem.selectedOption,
          shape: 'Custom',
          toppingMessage: customCakeItem.selectedOption
        }) : null,
        userId: user._id || user.id
      };

      const result = await OrderService.create(orderPayload);
      setOrderConfirmed(result);
      clearCart();
    } catch (error) {
      alert('Failed to place order: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppInstant = () => {
    if (!customerName || !customerPhone) {
      alert('Please enter your Name and Phone Number first!');
      return;
    }

    let msg = `*✨ NEW ONLINE ORDER - HALWIYAT ZAMZAM BAKERS ✨*\n\n`;
    msg += `👤 *Name*: ${customerName}\n`;
    msg += `📞 *Phone*: ${customerPhone}\n`;
    msg += `📍 *Order Type*: ${orderType}\n`;
    if (orderType === 'Delivery') msg += `🏠 *Address*: ${customerAddress}\n`;
    msg += `💳 *Payment Method*: ${paymentMethod}\n\n`;
    msg += `*🛒 ITEMS*:\n`;

    cart.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.name}* (${item.selectedOption}) x ${item.quantity} = Rs. ${item.price * item.quantity}\n`;
    });

    msg += `\n💵 *Subtotal*: Rs. ${subtotal}`;
    if (deliveryFee > 0) msg += `\n🛵 *Delivery Charges*: Rs. ${deliveryFee}`;
    msg += `\n💳 *TOTAL*: *Rs. ${totalAmount}*\n`;
    if (notes) msg += `\n📝 *Notes*: ${notes}\n`;

    window.open(`https://wa.me/923275001166?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-[#0d0d11] text-white flex items-center justify-center p-6">
        <div className="bg-[#14141a] border border-amber-500/20 rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full mx-auto flex items-center justify-center text-emerald-400 text-4xl">
            <FiCheckCircle />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Order Successfully Placed</span>
            <h2 className="text-3xl font-bold font-serif gold-gradient-text mt-1">Thank You For Your Order!</h2>
            <p className="text-xs text-gray-400 mt-2">
              Your Order ID is <span className="font-mono font-bold text-amber-400 text-sm">#{orderConfirmed.orderId}</span>
            </p>
          </div>

          <div className="bg-[#181820] p-4 rounded-xl text-xs space-y-2 text-left border border-amber-500/10">
            <div className="flex justify-between text-gray-300">
              <span>Customer:</span>
              <strong className="text-white">{orderConfirmed.customerName}</strong>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Payment Mode:</span>
              <span className="text-amber-400 font-bold">{orderConfirmed.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Order Type:</span>
              <span>{orderConfirmed.orderType}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-amber-400 pt-2 border-t border-amber-500/10">
              <span>Total Paid/Payable:</span>
              <span className="font-mono">Rs. {orderConfirmed.totalAmount}</span>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-300 flex items-center gap-2">
            <span>⏱️</span>
            <span>
              <strong>Estimated {orderConfirmed.orderType === 'Delivery' ? 'Delivery' : 'Pickup'} Time:</strong>
              {' '}{orderConfirmed.orderType === 'Delivery' ? '30-45 minutes' : '15-20 minutes'} from Timergara Main Branch counter.
            </span>
          </div>

          <p className="text-xs text-gray-400">
            Receptionist counter desk at Timergara Main Branch has received your order. Kitchen team is preparing your fresh items!
          </p>

          <div className="flex gap-3 pt-2">
            <Link
              to="/track-order"
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
            >
              Track My Order Live
            </Link>
            <Link
              to="/menu"
              className="py-3 px-4 bg-[#181820] text-gray-300 font-bold text-xs rounded-xl hover:bg-gray-800"
            >
              Back to Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d11] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400 bg-amber-500/10 px-4 py-1 rounded-full border border-amber-500/20">
            Authenticated Secure Checkout
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif gold-gradient-text">
            Complete Your Order
          </h1>
          <p className="text-xs text-gray-400">Select your preferred payment method & delivery details for Timergara</p>
        </div>

        {/* Auth Required Banner if not logged in */}
        {!user && (
          <div className="bg-[#181820] border border-amber-500/30 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Authentication Required</span>
              <h3 className="text-lg font-bold font-serif text-white">Please Sign In or Register to Checkout</h3>
              <p className="text-xs text-gray-400">Create an account or login to complete order, save address, and track delivery status.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link 
                to="/login?redirect=/checkout" 
                className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition flex items-center gap-1.5"
              >
                <FiLogIn /> Sign In
              </Link>
              <Link 
                to="/register?redirect=/checkout" 
                className="px-5 py-2.5 bg-[#121216] border border-amber-500/30 text-amber-400 font-bold text-xs rounded-xl hover:bg-amber-500/10 transition flex items-center gap-1.5"
              >
                <FiUserPlus /> Register
              </Link>
            </div>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="bg-[#14141a] border border-amber-500/20 rounded-3xl p-12 text-center space-y-4">
            <FiShoppingBag className="text-5xl text-amber-500/20 mx-auto" />
            <h3 className="text-xl font-bold font-serif text-amber-400">Your Cart is Empty</h3>
            <p className="text-xs text-gray-400">Please add sweets or bakery items before proceeding to checkout.</p>
            <Link to="/menu" className="inline-block px-6 py-3 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl">
              Browse Menu Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Form Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Customer Info Form */}
              <div className="bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold font-serif text-amber-400 flex items-center gap-2">
                  <FiUser /> 1. Customer & Delivery Information
                </h3>

                {/* Order Type Toggle */}
                <div className="grid grid-cols-2 gap-3 bg-[#181820] p-1.5 rounded-2xl border border-amber-500/20">
                  <button
                    type="button"
                    onClick={() => setOrderType('Delivery')}
                    className={`py-2.5 text-xs font-bold rounded-xl transition ${
                      orderType === 'Delivery' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Home Delivery (+Rs. 150)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('Pickup')}
                    className={`py-2.5 text-xs font-bold rounded-xl transition ${
                      orderType === 'Pickup' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Counter Pickup
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-gray-300 mb-1">Full Name *</label>
                    <input 
                      type="text" required
                      value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Muhammad Ali"
                      className="w-full px-3.5 py-2.5 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-300 mb-1">Phone Number (WhatsApp) *</label>
                    <input 
                      type="tel" required
                      value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0345 1234567"
                      className="w-full px-3.5 py-2.5 bg-[#181820] border border-amber-500/20 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {orderType === 'Delivery' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Delivery Address in Timergara *</label>
                    <textarea 
                      required rows={2}
                      value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Street name, house/shop number, Timergara bazaar area..."
                      className="w-full px-3.5 py-2.5 bg-[#181820] border border-amber-500/20 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Special Order Notes (Optional)</label>
                  <input 
                    type="text"
                    value={notes} onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Extra napkins, less sugar, pack in gift box..."
                    className="w-full px-3.5 py-2.5 bg-[#181820] border border-amber-500/20 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold font-serif text-amber-400 flex items-center gap-2">
                  <FiCreditCard /> 2. Select Payment Option
                </h3>

                <div className="space-y-3">
                  
                  {/* COD */}
                  <label className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition ${
                    paymentMethod === 'Cash on Delivery' ? 'bg-amber-500/10 border-amber-400' : 'bg-[#181820] border-amber-500/10'
                  }`}>
                    <input 
                      type="radio" name="payment" 
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                      className="accent-amber-500"
                    />
                    <FiTruck className="text-amber-400 text-xl" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Cash on Delivery (COD)</h4>
                      <p className="text-[11px] text-gray-400">Pay cash upon delivery or counter pickup</p>
                    </div>
                  </label>

                  {/* Online Card / Bank */}
                  <label className={`p-4 rounded-2xl border flex items-center gap-3 cursor-pointer transition ${
                    paymentMethod === 'Online Card / Bank Transfer' ? 'bg-amber-500/10 border-amber-400' : 'bg-[#181820] border-amber-500/10'
                  }`}>
                    <input 
                      type="radio" name="payment" 
                      checked={paymentMethod === 'Online Card / Bank Transfer'}
                      onChange={() => setPaymentMethod('Online Card / Bank Transfer')}
                      className="accent-amber-500"
                    />
                    <FaUniversity className="text-amber-400 text-lg" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Debit/Credit Card & Bank IBAN</h4>
                      <p className="text-[11px] text-gray-400">Instant online payment verification</p>
                    </div>
                  </label>

                </div>

                {/* Online Card Input Details */}
                {paymentMethod === 'Online Card / Bank Transfer' && (
                  <div className="bg-[#181820] p-4 rounded-2xl border border-amber-500/20 space-y-3 text-xs">
                    <p className="text-[11px] text-amber-300 font-mono">
                      🏦 Bank Account: Mechants Bank Timergara | IBAN: PK92ZAMZAM900012345
                    </p>
                    <div>
                      <label className="block text-gray-400 mb-1">Card Number</label>
                      <input 
                        type="text" placeholder="4242 •••• •••• 4242"
                        value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-[#121216] border border-amber-500/20 rounded-xl text-white font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-gray-400 mb-1">Expiry (MM/YY)</label>
                        <input 
                          type="text" placeholder="12/28"
                          value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 bg-[#121216] border border-amber-500/20 rounded-xl text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-1">CVC</label>
                        <input 
                          type="text" placeholder="123"
                          value={cardCvc} onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-3 py-2 bg-[#121216] border border-amber-500/20 rounded-xl text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-5 bg-[#14141a] border border-amber-500/20 rounded-3xl p-6 space-y-6 sticky top-28">
              <h3 className="text-base font-bold font-serif text-amber-400 border-b border-amber-500/10 pb-3">
                Order Summary ({cart.length} Items)
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="flex gap-2 items-center">
                      <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <h4 className="font-bold text-white line-clamp-1">{item.name}</h4>
                        <span className="text-[10px] text-amber-400 font-mono">{item.selectedOption} x {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-amber-400">Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-3 border-t border-amber-500/10 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-gray-400">
                    <span>Delivery Fee</span>
                    <span>Rs. {deliveryFee}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-amber-400 pt-2 border-t border-amber-500/10">
                  <span>Total Amount</span>
                  <span className="font-mono text-xl">Rs. {totalAmount}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xl shadow-amber-500/20 transition disabled:opacity-50"
                >
                  {loading 
                    ? 'Processing Order...' 
                    : user 
                      ? `Confirm & Place Order (Rs. ${totalAmount})`
                      : '🔒 Sign In & Complete Order'}
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppInstant}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <FaWhatsapp className="text-base" /> Instant WhatsApp Checkout
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500">
                <FiLock className="text-amber-400" /> 256-Bit SSL Encrypted & User-Authenticated
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
