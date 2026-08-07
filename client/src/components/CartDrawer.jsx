import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight, FiLock } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    getSubtotal 
  } = useCartStore();

  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const subtotal = getSubtotal();

  const handleProceedToCheckout = () => {
    closeCart();
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  const handleWhatsAppCheckout = () => {
    let message = `*✨ NEW CART INQUIRY - HALWIYAT ZAMZAM BAKERS ✨*\n\n`;
    if (user) message += `👤 *Customer*: ${user.name} (${user.phone})\n\n`;
    message += `*🛒 ITEMS*:\n`;
    
    cart.forEach((item, idx) => {
      message += `${idx + 1}. *${item.name}* (${item.selectedOption}) x ${item.quantity} = Rs. ${item.price * item.quantity}\n`;
    });

    message += `\n💳 *Subtotal*: *Rs. ${subtotal}*\n`;
    message += `Please confirm order delivery time!`;

    window.open(`https://wa.me/923275001166?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-[#121216] border-l border-amber-500/20 text-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-amber-500/20 flex items-center justify-between bg-gradient-to-r from-[#181820] to-[#121216]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <FiShoppingBag className="text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-amber-400 font-serif">Your Cart</h2>
                <p className="text-xs text-amber-200/60">Halwiyat Zamzam Bakers</p>
              </div>
            </div>
            <button 
              onClick={closeCart}
              className="p-2 text-gray-400 hover:text-amber-400 rounded-lg transition"
            >
              <FiX className="text-2xl" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <FiShoppingBag className="text-5xl mx-auto text-amber-500/30 mb-4" />
                <p className="text-lg font-medium text-amber-200/80">Your cart is empty</p>
                <p className="text-xs text-gray-500 mt-1">Explore our delicious sweets & bakery items!</p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div 
                  key={idx} 
                  className="bg-[#1a1a22] border border-amber-500/10 rounded-xl p-3 flex gap-3 items-center hover:border-amber-500/30 transition"
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-16 h-16 rounded-lg object-cover border border-amber-500/20"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                    <span className="text-xs text-amber-400 font-mono">{item.selectedOption}</span>
                    <div className="text-sm font-bold text-amber-400 mt-1">
                      Rs. {item.price * item.quantity}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 bg-[#121216] border border-amber-500/20 rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(idx, -1)}
                      className="p-1 text-gray-400 hover:text-amber-400"
                    >
                      <FiMinus className="text-xs" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(idx, 1)}
                      className="p-1 text-gray-400 hover:text-amber-400"
                    >
                      <FiPlus className="text-xs" />
                    </button>
                  </div>

                  <button 
                    onClick={() => removeFromCart(idx)}
                    className="p-2 text-red-400 hover:text-red-300 transition"
                  >
                    <FiTrash2 className="text-base" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-amber-500/20 bg-[#181820] space-y-4">
              <div className="flex justify-between items-center text-sm font-bold text-amber-400">
                <span>Subtotal:</span>
                <span className="font-mono text-xl">Rs. {subtotal}</span>
              </div>

              {!user && (
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300 flex items-center gap-2">
                  <FiLock className="text-amber-400 shrink-0 text-sm" />
                  <span>You will be prompted to Sign In before completing your order.</span>
                </div>
              )}

              <div className="space-y-2">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition"
                >
                  <span>{user ? 'Proceed to Checkout (COD/Card)' : 'Sign In & Proceed to Checkout'}</span>
                  <FiArrowRight />
                </button>

                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-2.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <FaWhatsapp /> Quick WhatsApp Order
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
