/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiService } from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Filters, FilterState } from '../components/Filters';
import { SkeletonGrid } from '../components/Loader';
import { QuickViewModal } from '../components/Modal';
import { Grid, List, SlidersHorizontal, AlertCircle, RefreshCw } from 'lucide-react';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInUrl = searchParams.get('search') || '';
  const categoryInUrl = searchParams.get('category') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeQuickView, setActiveQuickView] = useState<Product | null>(null);
  
  // Mobile filter drawer state
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sorting state
  const [sortBy, setSortBy] = useState<string>(() => {
    return searchParams.get('sort') || 'popularity';
  });

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    category: categoryInUrl,
    minPrice: 0,
    maxPrice: 3000,
    minRating: 0,
    brand: '',
    onlyInStock: false,
  });

  // Track max price from actual loaded products to adjust range
  const [maxPriceLimit, setMaxPriceLimit] = useState(3000);

  // Synchronize category selection from URL changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: categoryInUrl,
    }));
  }, [categoryInUrl]);

  // Synchronize sort state from URL changes
  useEffect(() => {
    const sortParam = searchParams.get('sort');
    if (sortParam) setSortBy(sortParam);
  }, [searchParams]);

  // Fetch products
  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch maximum 100 products for complete client-side filtering flexibility
      const { products: fetched } = await apiService.getProducts(100);
      setProducts(fetched);

      // Dynamically calculate actual max price to configure range slider
      const highestPrice = fetched.reduce((max, p) => (p.price > max ? p.price : max), 100);
      const roundedMax = Math.ceil(highestPrice / 100) * 100;
      setMaxPriceLimit(roundedMax);
      
      // Initialize filters with proper maxPrice on initial load
      setFilters(prev => ({
        ...prev,
        maxPrice: prev.maxPrice === 3000 ? roundedMax : prev.maxPrice
      }));

    } catch (err: any) {
      console.error('Error fetching catalog:', err);
      setError('Could not retrieve product catalog. Please verify your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Compute unique brands from the loaded products
  const availableBrands = Array.from(
    new Set(
      products
        .filter((p) => !filters.category || p.category === filters.category)
        .map((p) => p.brand)
        .filter((brand): brand is string => typeof brand === 'string' && brand !== '')
    )
  ).sort();

  // Apply filters and search
  const filteredProducts = products.filter((product) => {
    // 1. Search Query Filter
    if (searchInUrl) {
      const q = searchInUrl.toLowerCase();
      const matchTitle = product.title.toLowerCase().includes(q);
      const matchBrand = product.brand?.toLowerCase().includes(q) || false;
      const matchCategory = product.category.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      if (!matchTitle && !matchBrand && !matchCategory && !matchDesc) return false;
    }

    // 2. Category Filter
    if (filters.category && product.category !== filters.category) return false;

    // 3. Price Filter
    const discountedPrice = product.price * (1 - product.discountPercentage / 100);
    if (discountedPrice < filters.minPrice || discountedPrice > filters.maxPrice) return false;

    // 4. Rating Filter
    if (product.rating < filters.minRating) return false;

    // 5. Brand Filter
    if (filters.brand && product.brand !== filters.brand) return false;

    // 6. In Stock Filter
    if (filters.onlyInStock && product.stock <= 0) return false;

    return true;
  });

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.price * (1 - a.discountPercentage / 100);
    const priceB = b.price * (1 - b.discountPercentage / 100);

    switch (sortBy) {
      case 'price-asc':
        return priceA - priceB;
      case 'price-desc':
        return priceB - priceA;
      case 'rating':
        return b.rating - a.rating;
      case 'discount':
        return b.discountPercentage - a.discountPercentage;
      case 'popularity':
      default:
        // Default sort (combining rating & stock availability)
        return (b.rating * b.stock) - (a.rating * a.stock);
    }
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    
    // Update categories in URL
    const params = new URLSearchParams(searchParams);
    if (newFilters.category) {
      params.set('category', newFilters.category);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="products-catalog-page">
      
      {/* Search Header Info */}
      {searchInUrl && (
        <div className="bg-indigo-50/50 dark:bg-indigo-950/25 border border-indigo-100/40 dark:border-indigo-900/30 rounded-2xl p-5 mb-8 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Search results for "<span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{searchInUrl}</span>"
            <span className="text-gray-400 font-normal ml-1">({filteredProducts.length} items found)</span>
          </p>
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.delete('search');
              setSearchParams(params);
            }}
            className="text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT COLUMN: FILTERS SIDEBAR (Desktop: Visible, Mobile: Hidden) */}
        <div className="hidden lg:block lg:col-span-1">
          <Filters
            filters={filters}
            onFilterChange={handleFilterChange}
            availableBrands={availableBrands}
            maxPriceLimit={maxPriceLimit}
          />
        </div>

        {/* RIGHT COLUMN: PRODUCT GRID */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Controls Bar (Sort selection, Mobile filters toggle) */}
          <div className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl shadow-sm">
            
            {/* Mobile Filters Toggle Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <SlidersHorizontal size={14} className="text-indigo-600" />
              Filters
            </button>

            {/* Results Count Summary */}
            <p className="hidden sm:block text-xs font-bold text-gray-400 uppercase tracking-wider">
              Showing <span className="text-gray-700 dark:text-gray-300">{sortedProducts.length}</span> of <span className="text-gray-700 dark:text-gray-300">{products.length}</span> Products
            </p>

            {/* Sort Dropdown Selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:block">Sort By:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  const params = new URLSearchParams(searchParams);
                  params.set('sort', e.target.value);
                  setSearchParams(params);
                }}
                className="bg-gray-50 border border-gray-200 dark:border-gray-800 dark:bg-gray-900 rounded-xl py-1.5 px-3.5 text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="popularity">Popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>

          {/* MAIN GRID STATES */}
          {loading ? (
            <SkeletonGrid count={8} />
          ) : error ? (
            <div className="bg-rose-500/5 border border-rose-500/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-4">
              <AlertCircle size={40} className="text-rose-500" />
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Oops! Something went wrong</h3>
              <p className="text-xs text-gray-500 max-w-md">{error}</p>
              <button
                onClick={loadProducts}
                className="mt-2 flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow transition-colors cursor-pointer"
              >
                <RefreshCw size={14} />
                Try Again
              </button>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-16 text-center space-y-4">
              <SlidersHorizontal size={48} className="mx-auto text-gray-300 dark:text-gray-700 animate-pulse" />
              <h3 className="text-lg font-black text-gray-900 dark:text-white">No products found matching filters</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                Try widening your price range, clearing specific brands, or changing your category search query.
              </p>
              <button
                onClick={() => {
                  setFilters({
                    category: '',
                    minPrice: 0,
                    maxPrice: maxPriceLimit,
                    minRating: 0,
                    brand: '',
                    onlyInStock: false,
                  });
                  const params = new URLSearchParams(searchParams);
                  params.delete('category');
                  params.delete('search');
                  setSearchParams(params);
                }}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setActiveQuickView}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTERS MODAL DRAWER OVERLAY */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setShowMobileFilters(false)}
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
          />
          {/* Slider content */}
          <div className="relative w-80 max-w-[85vw] bg-white dark:bg-gray-900 h-full p-6 overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-4">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Refine Search</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="text-xs font-bold text-indigo-600 uppercase"
              >
                Done
              </button>
            </div>
            <div className="flex-1">
              <Filters
                filters={filters}
                onFilterChange={handleFilterChange}
                availableBrands={availableBrands}
                maxPriceLimit={maxPriceLimit}
              />
            </div>
          </div>
        </div>
      )}

      {/* QUICK VIEW DETAILS MODAL */}
      <QuickViewModal product={activeQuickView} onClose={() => setActiveQuickView(null)} />

    </div>
  );
};
