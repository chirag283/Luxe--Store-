/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ArrowLeft, CheckCircle2, Ticket, CreditCard, Truck, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { Order } from '../types';

export const Checkout: React.FC = () => {
  const {
    cart,
    clearCart,
    appliedCoupon,
    discountPercentage,
    subtotal,
    discountAmount,
    shippingCost,
    taxAmount,
    grandTotal,
    addToast
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  // If cart is empty and we are not in success state, redirect to cart
  useEffect(() => {
    if (cart.length === 0 && !isOrdered) {
      navigate('/cart');
    }
  }, [cart]);

  // Billing address state
  const [billing, setBilling] = useState({
    fullName: user?.name || '',
    addressLine: user?.address || '',
    city: '',
    postalCode: '',
    country: 'United States',
    phone: user?.phone || '',
  });

  // Shipping address state
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [shipping, setShipping] = useState({
    fullName: '',
    addressLine: '',
    city: '',
    postalCode: '',
    country: 'United States',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isPlacing, setIsPlacing] = useState(false);
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState<Order | null>(null);

  // Sync shipping address with billing if toggled
  useEffect(() => {
    if (sameAsBilling) {
      setShipping(billing);
    }
  }, [billing, sameAsBilling]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    formType: 'billing' | 'shipping'
  ) => {
    const { name, value } = e.target;
    if (formType === 'billing') {
      setBilling((prev) => ({ ...prev, [name]: value }));
    } else {
      setShipping((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPlacing(true);

    // Simulate payment and database latency
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const finalShippingAddress = sameAsBilling ? billing : shipping;
    const mockOrder: Order = {
      id: 'ORD_' + Math.floor(100000 + Math.random() * 900000),
      items: [...cart],
      shippingAddress: finalShippingAddress,
      billingAddress: billing,
      paymentMethod: paymentMethod.replace('_', ' ').toUpperCase(),
      couponCode: appliedCoupon || undefined,
      discountAmount,
      shippingCost,
      taxAmount,
      subtotal,
      grandTotal,
      date: new Date().toLocaleDateString(undefined, { dateStyle: 'long' }),
      status: 'Pending',
    };

    setOrderReceipt(mockOrder);
    setIsPlacing(false);
    setIsOrdered(true);
    addToast('Order placed successfully! Thank you.', 'success');
    
    // Clear cart in global state (we have saved copy in mockOrder!)
    clearCart();
  };

  // SUCCESS PAGE / RECEIPT VIEW STATE
  if (isOrdered && orderReceipt) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12" id="order-success-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-6 sm:p-10 shadow-lg space-y-8"
        >
          {/* Header success indicator */}
          <div className="text-center space-y-3">
            <div className="mx-auto h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle2 size={40} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Order Confirmed!
            </h1>
            <p className="text-xs text-gray-400">
              Thank you for shopping with Luxe Store. Your payment of <span className="text-indigo-600 font-bold">${orderReceipt.grandTotal.toFixed(2)}</span> has been securely processed.
            </p>
          </div>

          {/* Receipt Info Panel */}
          <div className="bg-gray-50 dark:bg-gray-950/20 rounded-2xl border border-gray-100 dark:border-gray-850 p-5 grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-gray-400 font-medium">Order Number</p>
              <p className="font-extrabold text-gray-900 dark:text-white mt-0.5">{orderReceipt.id}</p>
            </div>
            <div>
              <p className="text-gray-400 font-medium">Date Purchased</p>
              <p className="font-extrabold text-gray-900 dark:text-white mt-0.5">{orderReceipt.date}</p>
            </div>
            <div>
              <p className="text-gray-400 font-medium">Payment Channel</p>
              <p className="font-extrabold text-gray-900 dark:text-white mt-0.5">{orderReceipt.paymentMethod}</p>
            </div>
            <div>
              <p className="text-gray-400 font-medium">Shipment Status</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full mt-0.5">
                <Truck size={10} /> Pending Dispatch
              </span>
            </div>
          </div>

          {/* Purchased Items Invoice Details */}
          <div className="space-y-3.5 pt-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider pb-2 border-b border-gray-100 dark:border-gray-800">
              Purchased Items
            </h3>
            <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
              {orderReceipt.items.map((item) => {
                const discountPrice = item.product.price * (1 - item.product.discountPercentage / 100);
                return (
                  <div key={item.product.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className="text-gray-400 font-bold flex-shrink-0">x{item.quantity}</span>
                      <span className="text-gray-800 dark:text-gray-200 font-semibold truncate">{item.product.title}</span>
                    </div>
                    <span className="font-bold text-gray-950 dark:text-white flex-shrink-0">
                      ${(discountPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping Address Invoice Details */}
          <div className="space-y-2.5 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Shipment Address
            </h3>
            <div className="text-gray-600 dark:text-gray-300 font-medium space-y-1">
              <p className="font-bold text-gray-900 dark:text-white">{orderReceipt.shippingAddress.fullName}</p>
              <p>{orderReceipt.shippingAddress.addressLine}</p>
              <p>{orderReceipt.shippingAddress.city}, {orderReceipt.shippingAddress.postalCode}</p>
              <p>{orderReceipt.shippingAddress.country}</p>
              <p>Ph: {orderReceipt.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Calculations Invoice Summary */}
          <div className="space-y-2.5 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">${orderReceipt.subtotal.toFixed(2)}</span>
            </div>
            {orderReceipt.discountAmount > 0 && (
              <div className="flex justify-between text-rose-600 font-bold">
                <span>Coupon Discount ({orderReceipt.couponCode})</span>
                <span>-${orderReceipt.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500">
              <span>Shipping cost</span>
              <span>{orderReceipt.shippingCost === 0 ? 'FREE' : `$${orderReceipt.shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Tax (8.5%)</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">${orderReceipt.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-gray-900 dark:text-white pt-2.5 border-t border-gray-100 dark:border-gray-800">
              <span>Grand Total Paid</span>
              <span className="text-base text-indigo-600 dark:text-indigo-400">${orderReceipt.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Redirection button */}
          <div className="pt-6 flex justify-center">
            <Link
              to="/products"
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-indigo-600/10 flex items-center gap-2 transition-all hover:-translate-y-0.5"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="checkout-form-page">
      {/* Back to Cart link */}
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-indigo-600 mb-8 transition-colors">
        <ArrowLeft size={13} />
        Back to Shopping Cart
      </Link>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: CONTACT, BILLING, SHIPPING FORMS (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. BILLING ADDRESS PANEL */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider pb-2 border-b border-gray-100 dark:border-gray-800">
              Billing Address Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Full Name</label>
                <input
                  type="text"
                  required
                  id="fullName"
                  name="fullName"
                  value={billing.fullName}
                  onChange={(e) => handleInputChange(e, 'billing')}
                  placeholder="e.g. John Doe"
                  className="w-full bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-3.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Phone Number</label>
                <input
                  type="tel"
                  required
                  id="phone"
                  name="phone"
                  value={billing.phone}
                  onChange={(e) => handleInputChange(e, 'billing')}
                  placeholder="e.g. +1 (555) 019-2834"
                  className="w-full bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-3.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label htmlFor="addressLine" className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Address Line</label>
                <input
                  type="text"
                  required
                  id="addressLine"
                  name="addressLine"
                  value={billing.addressLine}
                  onChange={(e) => handleInputChange(e, 'billing')}
                  placeholder="Street name, suite or apartment number"
                  className="w-full bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-3.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="city" className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">City</label>
                <input
                  type="text"
                  required
                  id="city"
                  name="city"
                  value={billing.city}
                  onChange={(e) => handleInputChange(e, 'billing')}
                  placeholder="e.g. New York"
                  className="w-full bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-3.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="postalCode" className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Postal / ZIP Code</label>
                <input
                  type="text"
                  required
                  id="postalCode"
                  name="postalCode"
                  value={billing.postalCode}
                  onChange={(e) => handleInputChange(e, 'billing')}
                  placeholder="e.g. 10001"
                  className="w-full bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-3.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* 2. SHIPPING SAME AS BILLING ACCORDION */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                Shipping Address Details
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sameAsBilling"
                  checked={sameAsBilling}
                  onChange={(e) => setSameAsBilling(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="sameAsBilling" className="text-xs font-bold text-gray-500 select-none cursor-pointer">
                  Same as Billing Address
                </label>
              </div>
            </div>

            {!sameAsBilling && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                <div className="space-y-1.5">
                  <label htmlFor="shipping-fullName" className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    required
                    id="shipping-fullName"
                    name="fullName"
                    value={shipping.fullName}
                    onChange={(e) => handleInputChange(e, 'shipping')}
                    placeholder="e.g. Jane Doe"
                    className="w-full bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-3.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="shipping-phone" className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Phone Number</label>
                  <input
                    type="tel"
                    required
                    id="shipping-phone"
                    name="phone"
                    value={shipping.phone}
                    onChange={(e) => handleInputChange(e, 'shipping')}
                    placeholder="e.g. +1 (555) 019-2834"
                    className="w-full bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-3.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="shipping-addressLine" className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Address Line</label>
                  <input
                    type="text"
                    required
                    id="shipping-addressLine"
                    name="addressLine"
                    value={shipping.addressLine}
                    onChange={(e) => handleInputChange(e, 'shipping')}
                    placeholder="Street name, suite or apartment number"
                    className="w-full bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-3.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="shipping-city" className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">City</label>
                  <input
                    type="text"
                    required
                    id="shipping-city"
                    name="city"
                    value={shipping.city}
                    onChange={(e) => handleInputChange(e, 'shipping')}
                    placeholder="e.g. Los Angeles"
                    className="w-full bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-3.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="shipping-postalCode" className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Postal / ZIP Code</label>
                  <input
                    type="text"
                    required
                    id="shipping-postalCode"
                    name="postalCode"
                    value={shipping.postalCode}
                    onChange={(e) => handleInputChange(e, 'shipping')}
                    placeholder="e.g. 90001"
                    className="w-full bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-3.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. PAYMENT METHOD SELECTION */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider pb-2 border-b border-gray-100 dark:border-gray-800">
              Payment Method (Dummy)
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <label
                onClick={() => setPaymentMethod('credit_card')}
                className={`flex items-center gap-3 p-4 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                  paymentMethod === 'credit_card'
                    ? 'border-indigo-600 bg-indigo-500/5 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 text-gray-700 dark:text-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'credit_card'}
                  onChange={() => {}}
                  className="sr-only"
                />
                <CreditCard size={16} />
                <span>Credit / Debit Card</span>
              </label>

              <label
                onClick={() => setPaymentMethod('paypal')}
                className={`flex items-center gap-3 p-4 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                  paymentMethod === 'paypal'
                    ? 'border-indigo-600 bg-indigo-500/5 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                    : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 text-gray-700 dark:text-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => {}}
                  className="sr-only"
                />
                <Ticket size={16} />
                <span>PayPal Account</span>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER DETAILS SUMMARY (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider pb-3 border-b border-gray-100 dark:border-gray-800">
              Order Summary
            </h3>

            {/* Shopping Items Quick list */}
            <div className="space-y-3.5 max-h-[200px] overflow-y-auto pr-1">
              {cart.map((item) => {
                const discountPrice = item.product.price * (1 - item.product.discountPercentage / 100);
                return (
                  <div key={item.product.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-gray-400 font-bold">x{item.quantity}</span>
                      <span className="text-gray-700 dark:text-gray-300 font-semibold truncate">{item.product.title}</span>
                    </div>
                    <span className="font-bold text-gray-950 dark:text-white ml-2">
                      ${(discountPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Calculations Invoice Summary */}
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Shipping cost</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Estimated Tax (8.5%)</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-gray-900 dark:text-white pt-3 border-t border-gray-100 dark:border-gray-800">
                <span>Total Due</span>
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit checkout buttons */}
            <button
              type="submit"
              disabled={isPlacing}
              className="w-full h-12 rounded-xl text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
            >
              <ShieldCheck size={16} />
              <span>{isPlacing ? 'Processing Order...' : `Pay & Place Order ($${grandTotal.toFixed(2)})`}</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
