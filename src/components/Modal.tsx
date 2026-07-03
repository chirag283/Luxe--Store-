/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Heart, CheckCircle, AlertTriangle, ShieldCheck, Truck } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Rating } from './Rating';
import { useNavigate } from 'react-router-dom';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [selectedImg, setSelectedImg] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setSelectedImg(product.thumbnail || product.images[0]);
      setQuantity(1);
      // Disable body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [product]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const isFav = isInWishlist(product.id);
  const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);
  const isOutOfStock = product.stock <= 0;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onClose();
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Dialog Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          id="quickview-modal"
          className="relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto z-10 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row gap-8 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Left Column: Image Area */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="aspect-square w-full rounded-2xl bg-gray-50 dark:bg-gray-950/40 p-4 border border-gray-100 dark:border-gray-800/40 flex items-center justify-center relative">
              <img
                src={selectedImg}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain"
              />
              {product.discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-full shadow-sm">
                  {Math.round(product.discountPercentage)}% Off
                </div>
              )}
            </div>

            {/* Thumbnail Carousel */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImg(img)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 bg-gray-50 p-1 flex-shrink-0 transition-all ${
                      selectedImg === img
                        ? 'border-indigo-600 dark:border-indigo-400 scale-95 shadow-sm'
                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information details */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {/* Category, Brand, SKU */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                <span>{product.category.replace('-', ' ')}</span>
                <span>•</span>
                <span>{product.brand || 'Generic'}</span>
                <span>•</span>
                <span>SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white leading-tight mb-3">
                {product.title}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-5">
                <Rating rating={product.rating} showText reviewsCount={product.reviews?.length || 18} />
                
                {/* Stock availability badge */}
                {isOutOfStock ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full">
                    <AlertTriangle size={12} /> Out of Stock
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                    <CheckCircle size={12} /> {product.stock} In Stock
                  </span>
                )}
              </div>

              {/* Price layout */}
              <div className="flex items-baseline gap-3 mb-5 bg-gray-50 dark:bg-gray-950/20 p-4 rounded-2xl border border-gray-100/50 dark:border-gray-800/40">
                <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                  ${discountedPrice}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="text-sm text-gray-400 dark:text-gray-500 line-through font-semibold">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-6">
                {product.description}
              </p>

              {/* Bullet points of Trust/Guarantees */}
              <div className="grid grid-cols-2 gap-3 mb-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Truck size={14} className="text-indigo-600" />
                  <span>{product.shippingInformation || 'Fast Delivery'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <ShieldCheck size={14} className="text-indigo-600" />
                  <span>{product.warrantyInformation || '1-Year Warranty'}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions Form */}
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4">
                {/* Quantity input */}
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden h-11">
                  <button
                    onClick={handleDecrement}
                    disabled={isOutOfStock || quantity <= 1}
                    className="px-3.5 h-full hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 disabled:opacity-40 transition-colors font-bold text-lg"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-bold text-gray-800 dark:text-gray-200 min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={isOutOfStock || quantity >= product.stock}
                    className="px-3.5 h-full hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 disabled:opacity-40 transition-colors font-bold text-lg"
                  >
                    +
                  </button>
                </div>

                {/* Wishlist button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
                  className={`h-11 px-4 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                    isFav
                      ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40 text-rose-500'
                      : 'bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <Heart className="h-4.5 w-4.5" fill={isFav ? 'currentColor' : 'none'} />
                  <span>{isFav ? 'Wishlisted' : 'Add to Wishlist'}</span>
                </button>
              </div>

              {/* Buy / Cart Buttons */}
              <div className="grid grid-cols-2 gap-3.5">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="w-full flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ShoppingBag size={16} />
                  Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="w-full h-12 rounded-xl text-sm font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-600/10"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
