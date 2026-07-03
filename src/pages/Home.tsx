/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Clock, ShieldCheck, CreditCard, RotateCcw, Truck, Quote } from 'lucide-react';
import { apiService } from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { LoadingSpinner, SkeletonGrid } from '../components/Loader';
import { QuickViewModal } from '../components/Modal';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeQuickView, setActiveQuickView] = useState<Product | null>(null);
  const navigate = useNavigate();

  // Simple countdown timer for flash sale
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        clearInterval(timer);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    const loadHomeData = async () => {
      try {
        const { products } = await apiService.getProducts(30);
        if (!active) return;
        
        // Featured products (top rated)
        const sortedByRating = [...products].sort((a, b) => b.rating - a.rating);
        setFeaturedProducts(sortedByRating.slice(0, 4));

        // Trending products (highest discounts)
        const sortedByDiscount = [...products].sort((a, b) => b.discountPercentage - a.discountPercentage);
        setTrendingProducts(sortedByDiscount.slice(0, 4));

        // Best sellers (low stock levels representing high sales)
        const sortedBySales = [...products].filter(p => p.stock > 0).sort((a, b) => a.stock - b.stock);
        setBestSellers(sortedBySales.slice(0, 4));
        
      } catch (error) {
        console.error('Failed to load home page products:', error);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadHomeData();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-16 pb-16" id="home-page">
      
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-gray-100 to-indigo-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/20 py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100 dark:border-gray-900/60 rounded-b-[40px] shadow-sm">
        <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-indigo-400 blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-purple-400 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 dark:bg-indigo-500/5 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-500/20 text-xs font-bold uppercase tracking-wider"
            >
              <Sparkles size={13} className="animate-spin" style={{ animationDuration: '6s' }} />
              <span>THE ULTIMATE SUMMER COLLECTION 2026</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-tight"
            >
              Redefining Luxury & <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Digital Elegance.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Shop premium laptops, authentic cosmetics, handcrafted perfumes, designer furniture, and high-performance mobile devices. Up to 50% off with fast tracked delivery.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <Link
                to="/products"
                className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-md shadow-indigo-600/15 flex items-center gap-2 transition-all group"
              >
                <span>Shop Catalog</span>
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>
              
              <Link
                to="/categories"
                className="px-8 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 text-gray-700 dark:text-gray-200 rounded-2xl font-bold text-sm shadow-sm transition-all"
              >
                Explore Categories
              </Link>
            </motion.div>
          </div>

          {/* Hero Image / Banner Art */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="relative w-full max-w-md aspect-square bg-white/40 dark:bg-gray-900/40 border border-white/50 dark:border-gray-800/40 rounded-[3rem] p-8 shadow-xl backdrop-blur-md flex items-center justify-center"
            >
              <img
                src="https://dummyjson.com/product-images/1/thumbnail.jpg"
                alt="Featured Smartphone"
                className="w-4/5 h-4/5 object-contain hover:rotate-2 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl shadow-lg flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-extrabold text-sm">
                  5★
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">Premium Quality</h4>
                  <p className="text-[10px] text-gray-400">Authentic & Verified Products</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. CORPORATE TRUST VALUE BADGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/60 p-8 rounded-3xl shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-2xl"><Truck size={20} /></div>
            <div>
              <h4 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">Free Shipping</h4>
              <p className="text-[11px] text-gray-400">On all orders above $150</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-2xl"><RotateCcw size={20} /></div>
            <div>
              <h4 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">Easy Returns</h4>
              <p className="text-[11px] text-gray-400">30-day hassle-free policy</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-2xl"><ShieldCheck size={20} /></div>
            <div>
              <h4 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">Secure Payment</h4>
              <p className="text-[11px] text-gray-400">SSL 256-bit secure system</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-2xl"><CreditCard size={20} /></div>
            <div>
              <h4 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">24/7 Support</h4>
              <p className="text-[11px] text-gray-400">Dedicated expert assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between border-b border-gray-50 dark:border-gray-900/60 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">Featured Luxury Products</h2>
            <p className="text-xs text-gray-500">Highest rated selections from our global catalog</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 group">
            See All <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <SkeletonGrid count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={setActiveQuickView} />
            ))}
          </div>
        )}
      </section>

      {/* 4. EXCLUSIVE FLASH SALE BANNER & DEALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-900 via-purple-950 to-pink-900 rounded-[3rem] text-white p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-200 via-indigo-600 to-purple-800" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="px-3.5 py-1.5 bg-rose-600 rounded-full text-xs font-black uppercase tracking-wider">
                Limited Time Flash Deal
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Laptops, Tech, Cosmetics <br />
                All at Flat <span className="text-rose-400">50% Off</span>
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Register an account, apply coupon <span className="bg-white/10 px-2 py-1 rounded text-rose-300 font-mono">WELCOME50</span> during checkout, and score spectacular savings instantly.
              </p>

              {/* Timer UI */}
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-300">
                  <Clock size={16} className="text-rose-400" />
                  <span>Offer Ends In:</span>
                </div>
                <div className="flex gap-2">
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-2.5 min-w-[50px] text-center">
                    <span className="block text-base sm:text-lg font-black">{timeLeft.hours.toString().padStart(2, '0')}</span>
                    <span className="text-[9px] uppercase tracking-wide text-gray-400">Hrs</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-2.5 min-w-[50px] text-center">
                    <span className="block text-base sm:text-lg font-black">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                    <span className="text-[9px] uppercase tracking-wide text-gray-400">Min</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-2.5 min-w-[50px] text-center">
                    <span className="block text-base sm:text-lg font-black text-rose-400">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                    <span className="text-[9px] uppercase tracking-wide text-gray-400">Sec</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-center lg:justify-start">
                <Link
                  to="/products?category=laptops"
                  className="px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-rose-600/25 flex items-center gap-2 transition-transform hover:-translate-y-0.5 cursor-pointer"
                >
                  Shop Flash Sale Now
                </Link>
              </div>
            </div>

            {/* Visual art of flash product */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative aspect-square w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-6 flex items-center justify-center">
                <img
                  src="https://dummyjson.com/product-images/6/thumbnail.jpg"
                  alt="Laptop Deal"
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRENDING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between border-b border-gray-50 dark:border-gray-900/60 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">Trending Deals</h2>
            <p className="text-xs text-gray-500">Popular items with spectacular coupon and discount percentages</p>
          </div>
          <Link to="/products?sort=discount" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 group">
            See All <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <SkeletonGrid count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={setActiveQuickView} />
            ))}
          </div>
        )}
      </section>

      {/* 6. BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between border-b border-gray-50 dark:border-gray-900/60 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">Best Sellers</h2>
            <p className="text-xs text-gray-500">Fast-moving luxury items with high organic customer demand</p>
          </div>
          <Link to="/products" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 group">
            See All <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <SkeletonGrid count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={setActiveQuickView} />
            ))}
          </div>
        )}
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            TESTIMONIALS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            Loved By Luxury Connoisseurs
          </h2>
          <p className="text-xs text-gray-500 max-w-xl mx-auto">
            See what verified customers are saying about our premium product catalogs, secure checkout services, and swift deliveries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/60 p-6 rounded-2xl shadow-sm space-y-4">
            <Quote className="h-6 w-6 text-indigo-500 opacity-40" />
            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 italic">
              "Buying tech gear online is usually full of anxiety regarding authenticity. Luxe Store is a breath of fresh air. My laptop arrived perfectly sealed, tracked, and with fully valid warranty details!"
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="h-9 w-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-extrabold text-xs">
                AH
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-gray-900 dark:text-white">Arthur Pendelton</h4>
                <p className="text-[10px] text-gray-400">Verified Buyer • New York</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/60 p-6 rounded-2xl shadow-sm space-y-4">
            <Quote className="h-6 w-6 text-indigo-500 opacity-40" />
            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 italic">
              "The beauty cosmetics and fragrances collection has products I can't easily source elsewhere. And using the WELCOME50 coupon got me luxury scents for half price! Truly incredible service."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="h-9 w-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-extrabold text-xs">
                CL
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-gray-900 dark:text-white">Clarissa Lavigne</h4>
                <p className="text-[10px] text-gray-400">Verified Buyer • Paris</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/60 p-6 rounded-2xl shadow-sm space-y-4">
            <Quote className="h-6 w-6 text-indigo-500 opacity-40" />
            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 italic">
              "The design of this website is flawless. Transitioning between pages is so smooth, and the live search highlighting made finding exact models exceptionally quick. Highly recommended e-commerce shop!"
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="h-9 w-9 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-extrabold text-xs">
                MK
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-gray-900 dark:text-white">Maximilian Kross</h4>
                <p className="text-[10px] text-gray-400">Verified Buyer • Berlin</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK VIEW OVERLAY MODAL */}
      <QuickViewModal product={activeQuickView} onClose={() => setActiveQuickView(null)} />
      
    </div>
  );
};
