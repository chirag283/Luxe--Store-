/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCart();

  return (
    <div id="toast-container" className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            id={`toast-${toast.id}`}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 ${
              toast.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                : toast.type === 'error'
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-300'
                  : 'bg-blue-500/10 border-blue-500/20 text-blue-800 dark:text-blue-300'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-500" />}
              {toast.type === 'error' && <AlertTriangle className="h-5 w-5 text-rose-500" />}
              {toast.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
            </div>
            
            <div className="flex-1 text-sm font-medium leading-5">
              {toast.text}
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 ml-1 rounded-lg p-1 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
