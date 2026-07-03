/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Facebook, Twitter, Instagram, Youtube, Send, ShieldCheck, Heart, Mail, Phone, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Footer: React.FC = () => {
  const { addToast } = useCart();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      addToast(`Thank you for subscribing! Check your inbox for your 10% coupon code.`, 'success');
      setEmail('');
    }
  };

  return (
    <footer id="app-footer" className="bg-gray-900 text-gray-400 border-t border-gray-800 pt-16 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                <ShoppingBag size={18} />
              </div>
              <span className="text-base font-black tracking-tight text-white">
                LUXE STORE
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-gray-400">
              Your ultimate luxury lifestyle destination. We bring you handpicked premium tech, fashion, cosmetics, and accessories sourced globally. Guaranteed authenticity.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" aria-label="Facebook" className="p-2 rounded-lg bg-gray-800 hover:bg-indigo-600 hover:text-white transition-colors">
                <Facebook size={14} />
              </a>
              <a href="#" aria-label="Twitter" className="p-2 rounded-lg bg-gray-800 hover:bg-indigo-600 hover:text-white transition-colors">
                <Twitter size={14} />
              </a>
              <a href="#" aria-label="Instagram" className="p-2 rounded-lg bg-gray-800 hover:bg-indigo-600 hover:text-white transition-colors">
                <Instagram size={14} />
              </a>
              <a href="#" aria-label="Youtube" className="p-2 rounded-lg bg-gray-800 hover:bg-indigo-600 hover:text-white transition-colors">
                <Youtube size={14} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Explore Store
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition-colors">
                  Shop by Category
                </Link>
              </li>
              <li>
                <Link to="/products?category=smartphones" className="hover:text-white transition-colors">
                  Mobile & Tech
                </Link>
              </li>
              <li>
                <Link to="/products?category=beauty" className="hover:text-white transition-colors">
                  Cosmetics & Beauty
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Our Brand
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Shipping & Return Policy
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy & Terms
                </a>
              </li>
              <li className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold">
                <ShieldCheck size={14} />
                <span>100% Secured Payments</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-2">
              Stay Updated
            </h4>
            <p className="text-xs text-gray-400">
              Subscribe to our luxury newsletter to receive curated deals, seasonal catalog updates, and exclusive discount coupons.
            </p>
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-gray-800 border border-gray-700/80 rounded-xl py-2.5 pl-3.5 pr-10 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-1 top-1 bottom-1 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center justify-center cursor-pointer"
              >
                <Send size={12} />
              </button>
            </form>
          </div>

        </div>

        {/* Middle trust / contact ribbon */}
        <div className="border-t border-gray-800 py-6 my-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-indigo-400" />
            <span>500 Fashion Plaza, Madison Ave, New York, NY 10022</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="mailto:support@luxestore.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail size={14} className="text-indigo-400" />
              <span>support@luxestore.com</span>
            </a>
            <a href="tel:+15551234567" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={14} className="text-indigo-400" />
              <span>+1 (555) LUX-STORE</span>
            </a>
          </div>
        </div>

        {/* Bottom copyright & payment methods */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} Luxe Store Inc. All rights reserved. Made with <Heart size={10} className="inline text-rose-500 animate-pulse fill-rose-500" /> by Antigravity AI build team.
          </p>
          {/* Payment Methods Indicator Icons */}
          <div className="flex items-center gap-2 bg-gray-950/45 border border-gray-800 rounded-lg py-1 px-3">
            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mr-2">We Accept:</span>
            <span className="font-extrabold text-[10px] tracking-tight bg-gray-800 text-white py-0.5 px-1.5 rounded">VISA</span>
            <span className="font-extrabold text-[10px] tracking-tight bg-gray-800 text-white py-0.5 px-1.5 rounded">MC</span>
            <span className="font-extrabold text-[10px] tracking-tight bg-gray-800 text-white py-0.5 px-1.5 rounded">AMEX</span>
            <span className="font-extrabold text-[10px] tracking-tight bg-gray-800 text-white py-0.5 px-1.5 rounded">G-PAY</span>
            <span className="font-extrabold text-[10px] tracking-tight bg-gray-800 text-white py-0.5 px-1.5 rounded">APPLE</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
