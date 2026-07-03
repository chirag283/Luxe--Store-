/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { UserPlus, User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const { addToast } = useCart();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation checks
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const success = await register(name, email, password);
      if (success) {
        addToast('Welcome to Luxe Store! Account registered.', 'success');
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12" id="register-page">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 sm:p-10 shadow-lg space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
            Create Account
          </h1>
          <p className="text-xs text-gray-400">
            Sign up today to receive premium benefits, fast checkout, and 10% off.
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300 rounded-xl p-3 text-xs font-semibold animate-fade-in">
            {error}
          </div>
        )}

        {/* Form fields */}
        <form onSubmit={handleRegister} className="space-y-4.5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="reg-name" className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                id="reg-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label htmlFor="reg-email" className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                id="reg-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="reg-password" className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                id="reg-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create secure password"
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

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label htmlFor="reg-confirm" className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Confirm Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                id="reg-confirm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full bg-gray-50 border border-gray-200 dark:border-gray-800 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <UserPlus size={14} />
                Create Free Account
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-1">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-bold hover:underline">
            Login here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
