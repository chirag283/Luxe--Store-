/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';
import { Product } from '../types';

export const SearchBar: React.FC<{ onCloseMobile?: () => void }> = ({ onCloseMobile }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions with a basic debounce
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await apiService.searchProducts(query);
        // Only show top 5-6 suggestions
        setSuggestions(results.slice(0, 6));
        setIsOpen(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      if (onCloseMobile) onCloseMobile();
    }
  };

  const handleSuggestionClick = (productId: number) => {
    setQuery('');
    setIsOpen(false);
    navigate(`/products/${productId}`);
    if (onCloseMobile) onCloseMobile();
  };

  // Utility to highlight matching text
  const highlightMatch = (text: string, match: string) => {
    if (!match) return <span>{text}</span>;
    const regex = new RegExp(`(${match.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <mark key={index} className="bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold px-0.5 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div ref={dropdownRef} className="relative w-full max-w-md" id="global-search-bar">
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder="Search products, brands, tech..."
          className="w-full bg-gray-50 hover:bg-gray-100/80 focus:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 dark:focus:bg-gray-900 border border-gray-200/80 dark:border-gray-700/60 rounded-full py-2.5 pl-11 pr-10 text-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-inner"
        />
        
        {/* Left Search Icon */}
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

        {/* Right loading spinner or Clear button */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
          {loading ? (
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          ) : query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </form>

      {/* Floating Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden backdrop-blur-md bg-white/95 dark:bg-gray-900/95">
          <div className="py-2.5 max-h-[380px] overflow-y-auto">
            <div className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-gray-800/40 mb-1.5">
              Suggestions ({suggestions.length})
            </div>
            {suggestions.map((product) => {
              const discountPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);
              return (
                <button
                  key={product.id}
                  onClick={() => handleSuggestionClick(product.id)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/60 flex items-center gap-3.5 transition-colors group"
                >
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 object-contain rounded-lg bg-gray-50 p-1 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {highlightMatch(product.title, query)}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                      In {product.category.replace('-', ' ')}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-gray-950 dark:text-white">
                      ${discountPrice}
                    </span>
                    {product.discountPercentage > 0 && (
                      <p className="text-[9px] text-gray-400 line-through">
                        ${product.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/20 px-4 py-2 text-center border-t border-gray-50 dark:border-gray-800/40">
            <button
              onClick={handleSearchSubmit}
              className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              See all results for "{query}"
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
