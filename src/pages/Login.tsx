/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export const Login: React.FC = () => {
  const { login, forgotPassword } = useAuth();
  const { addToast } = useCart();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot password flow states
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const success = await login(email, password);
      if (success) {
        addToast('Successfully logged in! Welcome back.', 'success');
        // Redirect to homepage or previous page
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await forgotPassword(forgotEmail);
      addToast(`A password reset link has been dispatched to ${forgotEmail}!`, 'success');
      setIsForgotPassword(false);
      setForgotEmail('');
    } catch (err: any) {
      addToast(err.message || 'Email not found in our records.', 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16" id="login-page">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 sm:p-10 shadow-lg space-y-6"
      >
        {!isForgotPassword ? (
          <>
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                Welcome Back
              </h1>
              <p className="text-xs text-gray-400">
                Log in to access your saved wishlist, custom orders, and discounts.
              </p>
            </div>

            {/* Error alerts */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300 rounded-xl p-3 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Login form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Password</label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-[10px] font-bold text-indigo-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (default: password)"
                    className="w-full bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 pl-10 pr-10 text-xs text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <LogIn size={14} />
                    Log In
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-xs text-gray-500 pt-3">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 font-bold hover:underline">
                Register Free
              </Link>
            </div>

            {/* Hint Box */}
            <div className="bg-indigo-50/20 border border-indigo-100/30 rounded-2xl p-4 text-[11px] text-gray-500 leading-relaxed text-center">
              Demo log in details: <span className="font-bold text-indigo-600">user@example.com</span> / <span className="font-bold text-indigo-600">password</span>
            </div>
          </>
        ) : (
          <>
            {/* Forgot password subview */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                Reset Password
              </h1>
              <p className="text-xs text-gray-400">
                Provide your registered email address and we'll dispatch a link to recover access.
              </p>
            </div>

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="forgotEmail" className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Registered Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    id="forgotEmail"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="flex-1 h-11 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {forgotLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <RefreshCw size={13} />
                      Send Link
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};
