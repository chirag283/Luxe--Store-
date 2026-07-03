/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Mail, Phone, MapPin, Send, HelpCircle, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const Contact: React.FC = () => {
  const { addToast } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNum: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate network submission
    await new Promise((resolve) => setTimeout(resolve, 800));

    addToast(`Thank you, ${formData.name}. Your support ticket has been logged successfully! We will email you back within 30 minutes.`, 'success');
    setFormData({
      name: '',
      email: '',
      orderNum: '',
      subject: 'General Inquiry',
      message: '',
    });
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in" id="contact-us-page">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
          GET IN TOUCH
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          We're Here to Assist
        </h1>
        <p className="text-xs text-gray-500 max-w-xl mx-auto">
          Have an inquiry regarding specifications, orders, shipping timelines, or sizing? Submit the form below, and our luxury concierge specialists will respond promptly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: DIRECT CORRESPONDENCE CARD (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider pb-3 border-b border-gray-100 dark:border-gray-800">
              Direct Contact Details
            </h3>

            <div className="space-y-5">
              {/* Phone contact */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-xl mt-0.5"><Phone size={18} /></div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">Phone Hotline</h4>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-extrabold mt-0.5">+1 (555) LUX-STORE</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Mon - Sat: 9:00 AM - 6:00 PM EST</p>
                </div>
              </div>

              {/* Email contact */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-xl mt-0.5"><Mail size={18} /></div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">Email Address</h4>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-extrabold mt-0.5">support@luxestore.com</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Checked continuously, 24 hours a day.</p>
                </div>
              </div>

              {/* Address contact */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-xl mt-0.5"><MapPin size={18} /></div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">Corporate Headquarters</h4>
                  <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                    Luxe Store Inc. <br />
                    500 Fashion Plaza, Madison Ave, <br />
                    New York, NY 10022
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ Helper Note */}
          <div className="bg-gray-50 dark:bg-gray-950/20 border border-gray-100 dark:border-gray-850 p-6 rounded-3xl flex items-start gap-3">
            <HelpCircle className="text-indigo-600 h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">Looking for Instant Answers?</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed mt-1">
                We have prepared answers to the most common questions on our <span className="font-semibold text-indigo-600 hover:underline">FAQ Page</span>, covering discount applications, returns, tracking, and warranty validation.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SUPPORT TICKETING FORM (7 Columns) */}
        <div className="lg:col-span-7 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider pb-3 border-b border-gray-100 dark:border-gray-800 mb-2">
              Log a Support Ticket
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Full Name</label>
                <input
                  type="text"
                  required
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                  className="w-full bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-3.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  required
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-3.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="orderNum" className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Order Number <span className="text-gray-300 font-normal">(Optional)</span></label>
                <input
                  type="text"
                  id="orderNum"
                  name="orderNum"
                  value={formData.orderNum}
                  onChange={handleInputChange}
                  placeholder="e.g. ORD_592834"
                  className="w-full bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-3.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Subject Category</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-3.5 text-xs text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Order Tracking">Order Tracking</option>
                  <option value="Return / Warranty">Return / Warranty</option>
                  <option value="Bulk Purchase">Bulk Purchase</option>
                  <option value="Technical Support">Technical Support</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label htmlFor="message" className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Message Text</label>
                <textarea
                  required
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Provide precise details of your inquiry..."
                  className="w-full bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 px-3.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[120px] resize-y"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send size={13} />
                  Submit Ticket
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
