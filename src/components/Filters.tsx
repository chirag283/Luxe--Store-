/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { apiService, Category } from '../services/api';
import { Filter, RotateCcw, ChevronDown, Check, Star } from 'lucide-react';

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  brand: string;
  onlyInStock: boolean;
}

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  availableBrands: string[];
  maxPriceLimit?: number;
}

export const Filters: React.FC<FiltersProps> = ({
  filters,
  onFilterChange,
  availableBrands,
  maxPriceLimit = 2000,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [catOpen, setCatOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [brandOpen, setBrandOpen] = useState(true);
  const [ratingOpen, setRatingOpen] = useState(true);

  // Load categories
  useEffect(() => {
    let active = true;
    const fetchCats = async () => {
      try {
        const cats = await apiService.getCategories();
        if (active) setCategories(cats);
      } catch (error) {
        console.error('Failed to load categories in filters:', error);
      }
    };
    fetchCats();
    return () => {
      active = false;
    };
  }, []);

  const handleCategorySelect = (slug: string) => {
    onFilterChange({
      ...filters,
      category: filters.category === slug ? '' : slug,
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      maxPrice: Number(e.target.value),
    });
  };

  const handleRatingSelect = (rating: number) => {
    onFilterChange({
      ...filters,
      minRating: filters.minRating === rating ? 0 : rating,
    });
  };

  const handleBrandSelect = (brand: string) => {
    onFilterChange({
      ...filters,
      brand: filters.brand === brand ? '' : brand,
    });
  };

  const handleStockToggle = () => {
    onFilterChange({
      ...filters,
      onlyInStock: !filters.onlyInStock,
    });
  };

  const handleReset = () => {
    onFilterChange({
      category: '',
      minPrice: 0,
      maxPrice: maxPriceLimit,
      minRating: 0,
      brand: '',
      onlyInStock: false,
    });
  };

  return (
    <div id="product-filters-sidebar" className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm sticky top-28 space-y-6">
      
      {/* Filters Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
            Filter Products
          </h3>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
          title="Reset all filters"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      {/* Stock Availability Toggle Filter */}
      <div className="py-2 flex items-center justify-between">
        <label htmlFor="stock-toggle" className="text-xs font-bold text-gray-700 dark:text-gray-300 select-none cursor-pointer">
          In Stock Only
        </label>
        <button
          id="stock-toggle"
          onClick={handleStockToggle}
          aria-checked={filters.onlyInStock}
          role="switch"
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600/20 ${
            filters.onlyInStock ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-800'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              filters.onlyInStock ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Categories Accordion */}
      <div className="border-t border-gray-100 dark:border-gray-800/60 pt-4">
        <button
          onClick={() => setCatOpen(!catOpen)}
          className="flex items-center justify-between w-full text-left text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-3 cursor-pointer"
        >
          <span>Categories</span>
          <ChevronDown size={14} className={`transform transition-transform ${catOpen ? 'rotate-180' : ''}`} />
        </button>
        {catOpen && (
          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
            {categories.map((cat) => {
              const isSelected = filters.category === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {isSelected && <Check size={12} className="text-indigo-600 dark:text-indigo-400" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Slider Accordion */}
      <div className="border-t border-gray-100 dark:border-gray-800/60 pt-4">
        <button
          onClick={() => setPriceOpen(!priceOpen)}
          className="flex items-center justify-between w-full text-left text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-4 cursor-pointer"
        >
          <span>Price Filter</span>
          <ChevronDown size={14} className={`transform transition-transform ${priceOpen ? 'rotate-180' : ''}`} />
        </button>
        {priceOpen && (
          <div className="space-y-3">
            <input
              type="range"
              min={0}
              max={maxPriceLimit}
              value={filters.maxPrice}
              onChange={handlePriceChange}
              className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-500"
            />
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
              <span>$0</span>
              <span className="bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-lg border border-indigo-100/50 dark:border-indigo-950">
                Up to ${filters.maxPrice}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Brand Accordion */}
      {availableBrands.length > 0 && (
        <div className="border-t border-gray-100 dark:border-gray-800/60 pt-4">
          <button
            onClick={() => setBrandOpen(!brandOpen)}
            className="flex items-center justify-between w-full text-left text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-3 cursor-pointer"
          >
            <span>Brands</span>
            <ChevronDown size={14} className={`transform transition-transform ${brandOpen ? 'rotate-180' : ''}`} />
          </button>
          {brandOpen && (
            <div className="space-y-1 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
              {availableBrands.map((brand) => {
                const isSelected = filters.brand === brand;
                return (
                  <button
                    key={brand}
                    onClick={() => handleBrandSelect(brand)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <span className="truncate">{brand}</span>
                    {isSelected && <Check size={12} className="text-indigo-600 dark:text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Rating Filter Accordion */}
      <div className="border-t border-gray-100 dark:border-gray-800/60 pt-4">
        <button
          onClick={() => setRatingOpen(!ratingOpen)}
          className="flex items-center justify-between w-full text-left text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-3 cursor-pointer"
        >
          <span>Customer Rating</span>
          <ChevronDown size={14} className={`transform transition-transform ${ratingOpen ? 'rotate-180' : ''}`} />
        </button>
        {ratingOpen && (
          <div className="space-y-1">
            {[4, 3, 2, 1].map((stars) => {
              const isSelected = filters.minRating === stars;
              return (
                <button
                  key={stars}
                  onClick={() => handleRatingSelect(stars)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-amber-500">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < stars ? 'currentColor' : 'none'}
                          className={i < stars ? 'stroke-amber-500' : 'text-gray-300 dark:text-gray-600'}
                        />
                      ))}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-semibold">& Up</span>
                  </div>
                  {isSelected && <Check size={12} className="text-indigo-600 dark:text-indigo-400" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
