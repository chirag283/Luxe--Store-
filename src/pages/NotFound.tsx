/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6" id="not-found-page">
      {/* 404 Indicator */}
      <div className="mx-auto w-32 h-32 bg-indigo-50 dark:bg-indigo-950/20 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 relative">
        <ShieldAlert size={56} className="stroke-[1.5]" />
        <span className="absolute bottom-1 right-1 bg-indigo-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-md">
          404
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
          Page Not Found
        </h1>
        <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
          The requested URL does not exist on our servers, or the product has been removed due to catalog curation.
        </p>
      </div>

      <div className="pt-4 flex justify-center">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all hover:-translate-y-0.5"
        >
          <ArrowLeft size={13} />
          <span>Back to Catalog</span>
        </Link>
      </div>
    </div>
  );
};
