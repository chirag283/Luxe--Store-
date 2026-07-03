/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

export const Wishlist: React.FC = () => {
  const { wishlist } = useCart();

  // If wishlist is empty, render custom vector illustration state
  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6" id="empty-wishlist-view">
        <div className="mx-auto w-32 h-32 bg-rose-50 dark:bg-rose-950/20 rounded-full flex items-center justify-center text-rose-500 dark:text-rose-400">
          <Heart size={56} className="stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Your Wishlist is Empty</h1>
          <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
            You haven't saved any items to your wishlist yet. Tap the heart icon on any product card while browsing to save items here!
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs shadow-md transition-transform hover:-translate-y-0.5"
        >
          <span>Find Luxury Products</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="wishlist-page">
      <div className="border-b border-gray-100 dark:border-gray-800 pb-5 mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
          Saved Wishlist ({wishlist.length} Items)
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Your personal collection of premium watches, tech, and beauty items.
        </p>
      </div>

      {/* Grid of Wishlist Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
