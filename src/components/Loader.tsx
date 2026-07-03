/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

// Loading Spinner Component
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; message?: string }> = ({
  size = 'md',
  message,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div
        className={`${sizeClasses[size]} border-gray-200 border-t-indigo-600 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

// Product Card Skeleton Loader
export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800/60 p-4 shadow-sm animate-pulse flex flex-col h-full">
      {/* Image Skeleton */}
      <div className="relative aspect-square w-full rounded-xl bg-gray-200 dark:bg-gray-700 mb-4" />
      
      {/* Category Skeleton */}
      <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700 mb-2" />
      
      {/* Title Skeleton */}
      <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700 mb-3" />
      
      {/* Rating & Stock Skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      
      {/* Price & CTA Skeleton */}
      <div className="mt-auto pt-3 border-t border-gray-50 dark:border-gray-800/40 flex items-center justify-between">
        <div className="h-6 w-1/4 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-9 w-1/3 rounded-lg bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
};

// Grid of Product Cards Skeleton
export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
};

// Details Page Skeleton
export const SkeletonDetails: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-2xl bg-gray-200 dark:bg-gray-700" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="aspect-square rounded-xl bg-gray-200 dark:bg-gray-700" />
            ))}
          </div>
        </div>

        {/* Right Column: Product Metadata */}
        <div className="space-y-6">
          <div className="h-4 w-1/6 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-10 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="flex gap-4">
            <div className="h-5 w-24 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-16 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="h-12 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="flex gap-4 pt-6">
            <div className="h-12 w-1/3 rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="h-12 w-1/3 rounded-xl bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
};
