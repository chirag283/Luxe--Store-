/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, Tag, X, ShieldAlert, Truck, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Cart: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    appliedCoupon,
    discountPercentage,
    subtotal,
    discountAmount,
    shippingCost,
    taxAmount,
    grandTotal,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplying(true);
    await applyCoupon(couponInput);
    setCouponInput('');
    setApplying(false);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // If cart is empty, render custom vector illustration state
  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6" id="empty-cart-view">
        <div className="mx-auto w-32 h-32 bg-indigo-50 dark:bg-indigo-950/20 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <ShoppingBag size={56} className="stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Your Shopping Cart is Empty</h1>
          <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
            Looks like you haven't added anything to your cart yet. Browse our exclusive departments to find luxury smartphones, cosmetics, and lifestyle gear!
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs shadow-md transition-transform hover:-translate-y-0.5"
        >
          <span>Explore Catalog</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="shopping-cart-page">
      <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-8 tracking-tight uppercase">
        Shopping Cart ({cart.reduce((tot, i) => tot + i.quantity, 0)} Items)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: SHOPPING ITEMS LIST (8 Columns) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Product Details</span>
            <button
              onClick={clearCart}
              className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 size={13} />
              Clear Cart
            </button>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {cart.map((item) => {
                const discountPrice = item.product.price * (1 - item.product.discountPercentage / 100);
                const itemTotal = discountPrice * item.quantity;
                
                return (
                  <motion.div
                    key={item.product.id}
                    id={`cart-item-${item.product.id}`}
                    layout
                    exit={{ opacity: 0, x: -30 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Image & Details */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <Link to={`/products/${item.product.id}`} className="h-20 w-20 rounded-2xl bg-gray-50 border border-gray-100 p-2 flex-shrink-0 flex items-center justify-center">
                        <img
                          src={item.product.thumbnail}
                          alt={item.product.title}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link to={`/products/${item.product.id}`} className="hover:text-indigo-600 transition-colors">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {item.product.title}
                          </h3>
                        </Link>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mt-0.5">
                          {item.product.brand || 'Luxe Brands'}
                        </p>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-xs font-black text-gray-950 dark:text-gray-300">
                            ${discountPrice.toFixed(2)}
                          </span>
                          {item.product.discountPercentage > 0 && (
                            <span className="text-[10px] text-gray-400 line-through">
                              ${item.product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-gray-50 dark:border-gray-800 pt-3 sm:pt-0">
                      
                      {/* Quantity selector */}
                      <div className="flex items-center border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden h-9">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2.5 h-full hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 font-bold transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-bold text-gray-800 dark:text-gray-200 min-w-[28px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="px-2.5 h-full hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 font-bold disabled:opacity-40 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Total Item Price */}
                      <span className="text-sm font-extrabold text-gray-950 dark:text-white min-w-[70px] text-right">
                        ${itemTotal.toFixed(2)}
                      </span>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        aria-label="Remove item"
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Delivery Policy Note */}
          <div className="bg-indigo-50/20 border border-indigo-100/30 rounded-3xl p-5 flex items-start gap-3 mt-4">
            <Truck className="text-indigo-600 h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white">Shipping Guarantee</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">
                We provide free premium tracked delivery for orders above $150. All item deliveries are insured and handled by trusted shipping partners.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY CARD (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider pb-3 border-b border-gray-100 dark:border-gray-800">
              Order Summary
            </h3>

            {/* Calculations Breakdown */}
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-rose-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Tag size={12} />
                    Coupon Discount ({discountPercentage}%)
                  </span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-500">
                <span>Shipping Cost</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {shippingCost === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `$${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-gray-500">
                <span>Estimated Tax (8.5%)</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">${taxAmount.toFixed(2)}</span>
              </div>

              {/* Grand Total */}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-between text-sm font-extrabold text-gray-900 dark:text-white">
                <span>Grand Total</span>
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3.5 py-2">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-300 font-bold">
                    <Tag size={12} />
                    <span>Coupon "{appliedCoupon}" Active</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    aria-label="Remove coupon"
                    className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-emerald-800 dark:text-emerald-300 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon Code"
                    className="flex-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl py-2 px-3 text-xs placeholder-gray-400 text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 uppercase"
                  />
                  <button
                    type="submit"
                    disabled={applying || !couponInput.trim()}
                    className="px-4 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-950 rounded-xl text-xs font-bold transition-colors disabled:opacity-45 cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
              <p className="text-[10px] text-gray-400 font-medium mt-1.5">
                Try codes: <span className="font-bold">SAVE10</span> (10% off), <span className="font-bold">WELCOME50</span> (50% off)
              </p>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full h-12 rounded-xl text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Secure details certificate */}
          <div className="flex items-center gap-2 justify-center text-[11px] text-gray-400">
            <ShieldAlert size={12} className="text-indigo-500" />
            <span>SSL Secured Checkout Environment</span>
          </div>
        </div>

      </div>
    </div>
  );
};
