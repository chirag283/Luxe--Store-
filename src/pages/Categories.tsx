/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService, Category } from '../services/api';
import { LoadingSpinner } from '../components/Loader';
import {
  Laptop,
  Smartphone,
  Sparkles,
  Award,
  Home,
  Tv,
  Shirt,
  Glasses,
  Gem,
  ShoppingBag,
  Footprints,
  Clock,
  Wrench,
  UtensilsCrossed,
  Car,
  ChevronRight
} from 'lucide-react';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchCats = async () => {
      try {
        const cats = await apiService.getCategories();
        if (active) setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories page:', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchCats();
    return () => {
      active = false;
    };
  }, []);

  // Utility to map categories to appropriate Lucide Icons for high fidelity
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'beauty':
      case 'skin-care':
        return <Sparkles className="h-6 w-6" />;
      case 'fragrances':
        return <Award className="h-6 w-6" />;
      case 'furniture':
      case 'home-decoration':
        return <Home className="h-6 w-6" />;
      case 'kitchen-accessories':
        return <UtensilsCrossed className="h-6 w-6" />;
      case 'laptops':
        return <Laptop className="h-6 w-6" />;
      case 'smartphones':
      case 'mobile-accessories':
        return <Smartphone className="h-6 w-6" />;
      case 'mens-shirts':
      case 'womens-dresses':
      case 'tops':
        return <Shirt className="h-6 w-6" />;
      case 'mens-shoes':
      case 'womens-shoes':
        return <Footprints className="h-6 w-6" />;
      case 'mens-watches':
      case 'womens-watches':
        return <Clock className="h-6 w-6" />;
      case 'sunglasses':
        return <Glasses className="h-6 w-6" />;
      case 'womens-jewellery':
        return <Gem className="h-6 w-6" />;
      case 'motorcycle':
      case 'vehicle':
        return <Car className="h-6 w-6" />;
      case 'sports-accessories':
        return <Wrench className="h-6 w-6" />;
      default:
        return <ShoppingBag className="h-6 w-6" />;
    }
  };

  // List of beautiful matching background gradients for cards
  const getGradient = (index: number) => {
    const gradients = [
      'from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 text-blue-600 dark:text-blue-400 border-blue-500/10',
      'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/10',
      'from-purple-500/10 to-fuchsia-500/10 dark:from-purple-500/5 dark:to-fuchsia-500/5 text-purple-600 dark:text-purple-400 border-purple-500/10',
      'from-rose-500/10 to-pink-500/10 dark:from-rose-500/5 dark:to-pink-500/5 text-rose-600 dark:text-rose-400 border-rose-500/10',
      'from-amber-500/10 to-orange-500/10 dark:from-amber-500/5 dark:to-orange-500/5 text-amber-600 dark:text-amber-400 border-amber-500/10',
      'from-violet-500/10 to-purple-500/10 dark:from-violet-500/5 dark:to-purple-500/5 text-violet-600 dark:text-violet-400 border-violet-500/10',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fade-in" id="categories-page">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
          BROWSE CATALOG
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          Shop by Department
        </h1>
        <p className="text-xs text-gray-500 max-w-xl mx-auto">
          Explore our extensive catalog of genuine luxury items organized neatly by category. Tap any card to view available models.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading curated departments..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const gradientClass = getGradient(index);
            return (
              <Link
                key={category.slug}
                to={`/products?category=${category.slug}`}
                id={`category-card-${category.slug}`}
                className={`group relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 hover:shadow-lg dark:hover:shadow-indigo-950/20 transition-all duration-300 flex flex-col justify-between min-h-[160px] overflow-hidden`}
              >
                {/* Background abstract decoration */}
                <div className="absolute right-0 bottom-0 w-24 h-24 rounded-tl-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 group-hover:scale-110 transition-transform duration-500" />

                {/* Top: Icon container */}
                <div className={`p-3.5 rounded-2xl bg-gradient-to-tr border w-fit shadow-inner ${gradientClass.split(' ').slice(0, 3).join(' ')}`}>
                  {getCategoryIcon(category.slug)}
                </div>

                {/* Bottom: Label and Navigation clicker */}
                <div className="mt-6 flex items-center justify-between relative z-10">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mt-0.5">
                      View Collection
                    </p>
                  </div>
                  <div className="h-8 w-8 rounded-full border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/30 transition-all shadow-sm">
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
