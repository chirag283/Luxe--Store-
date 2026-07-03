/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Rating } from './Rating';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const navigate = useNavigate();

  const isFav = isInWishlist(product.id);
  
  // Calculate discount price
  const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
      navigate('/cart');
    }
  };

  return (
    <motion.div
      id={`product-card-${product.id}`}
      layout
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg dark:hover:shadow-indigo-950/20 transition-all flex flex-col h-full"
    >
      {/* Discount Tag Overlay */}
      {product.discountPercentage > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-rose-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm tracking-wide">
          {Math.round(product.discountPercentage)}% OFF
        </div>
      )}

      {/* Action Buttons Overlay on Hover */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
          className={`p-2.5 rounded-full border shadow-sm backdrop-blur-md transition-all duration-300 ${
            isFav
              ? 'bg-rose-50 border-rose-100 text-rose-500 hover:bg-rose-100 dark:bg-rose-950/50 dark:border-rose-900/40'
              : 'bg-white/85 dark:bg-gray-900/80 border-gray-100 dark:border-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          <Heart className="h-4.5 w-4.5" fill={isFav ? 'currentColor' : 'none'} />
        </button>

        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            aria-label="Quick view product details"
            className="p-2.5 rounded-full bg-white/85 dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 shadow-sm backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100"
          >
            <Eye className="h-4.5 w-4.5" />
          </button>
        )}
      </div>

      {/* Product Image Link */}
      <Link to={`/products/${product.id}`} className="block relative aspect-square w-full bg-gray-50 dark:bg-gray-900/20 overflow-hidden">
        <img
          src={product.thumbnail || (product.images && product.images[0])}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 p-4"
          loading="lazy"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-gray-900/90 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg border border-gray-700">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category & Brand */}
        <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mb-1.5">
          <span>{product.category.replace('-', ' ')}</span>
          {product.brand && <span className="max-w-[120px] truncate">{product.brand}</span>}
        </div>

        {/* Product Title */}
        <Link to={`/products/${product.id}`} className="block mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 min-h-[40px] leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Rating and Stock Alert */}
        <div className="flex items-center justify-between gap-1 mb-4 mt-auto">
          <Rating rating={product.rating} size={14} showText />
          {isLowStock && (
            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 animate-pulse bg-amber-500/10 dark:bg-amber-500/5 px-2 py-0.5 rounded-md">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Pricing Layout */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg font-extrabold text-gray-900 dark:text-white">
            ${discountedPrice}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Action CTAs */}
        <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-gray-50 dark:border-gray-800/40">
          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-xs font-semibold border transition-all duration-300 ${
              isOutOfStock
                ? 'bg-gray-50 border-gray-200 text-gray-400 dark:bg-gray-800/20 dark:border-gray-800 dark:text-gray-600 cursor-not-allowed'
                : 'bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/80 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add
          </button>
          
          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className={`py-2 px-1 rounded-xl text-xs font-bold text-center transition-all duration-300 ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 dark:bg-gray-800/40 dark:text-gray-600 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-sm hover:shadow-indigo-600/20'
            }`}
          >
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};
