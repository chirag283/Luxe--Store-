/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Heart,
  User,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  LogOut,
  HelpCircle,
  Mail,
  Info
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SearchBar } from './SearchBar';

export const Navbar: React.FC = () => {
  const { cart, wishlist } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile drawer and dropdowns on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  // Handle scroll trigger for sticky background change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalWishlistItems = wishlist.length;

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50 origin-left" style={{ scaleX: 0 }} id="scroll-progress" />

      {/* Top Banner Offer / Flash Sale */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-700 text-white py-1.5 px-4 text-center text-xs font-bold tracking-wide flex items-center justify-center gap-2 relative z-50 shadow-sm">
        <Sparkles size={13} className="animate-bounce" />
        <span>FLASH SALE: USE COUPON <span className="bg-white/20 px-1.5 py-0.5 rounded text-amber-300 select-all">WELCOME50</span> FOR 50% OFF TODAY!</span>
      </div>

      {/* Main Navbar container */}
      <header
        id="app-header"
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-md shadow-md border-b border-gray-100 dark:border-gray-900 py-3'
            : 'bg-white dark:bg-gray-950 border-b border-gray-50 dark:border-gray-900/60 py-4.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0" id="brand-logo">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:rotate-6 transition-transform duration-300">
              <ShoppingBag className="h-5.5 w-5.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-gray-900 dark:text-white leading-none">
                LUXE
              </span>
              <span className="text-[9px] font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400">
                STORE
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar (Hidden on Mobile) */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <SearchBar />
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900/40'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900/40'
                }`
              }
            >
              Categories
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900/40'
                }`
              }
            >
              Products
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900/40'
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900/40'
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className="p-2.5 rounded-xl border border-transparent hover:border-gray-100 dark:hover:border-gray-800 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-colors cursor-pointer"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Wishlist Link with count badge */}
            <Link
              to="/wishlist"
              aria-label={`Wishlist: ${totalWishlistItems} items`}
              className="p-2.5 rounded-xl border border-transparent hover:border-gray-100 dark:hover:border-gray-800 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-colors relative"
            >
              <Heart size={18} />
              {totalWishlistItems > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-rose-600 text-white text-[9px] font-extrabold h-4.5 w-4.5 rounded-full flex items-center justify-center border border-white dark:border-gray-950 animate-pulse">
                  {totalWishlistItems}
                </span>
              )}
            </Link>

            {/* Cart Link with count badge */}
            <Link
              to="/cart"
              aria-label={`Shopping Cart: ${totalCartItems} items`}
              className="p-2.5 rounded-xl border border-transparent hover:border-gray-100 dark:hover:border-gray-800 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-colors relative"
            >
              <ShoppingBag size={18} />
              {totalCartItems > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-indigo-600 text-white text-[9px] font-extrabold h-4.5 w-4.5 rounded-full flex items-center justify-center border border-white dark:border-gray-950">
                  {totalCartItems}
                </span>
              )}
            </Link>

            {/* User Account State with Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    aria-label="Toggle user menu"
                    className="flex items-center gap-1.5 p-1 rounded-full border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 bg-gray-50 dark:bg-gray-900 transition-colors cursor-pointer"
                  >
                    <div className="h-7 w-7 rounded-full bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown size={14} className="text-gray-500 mr-1 hidden sm:block" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl py-2 z-50 backdrop-blur-md bg-white/95 dark:bg-gray-900/95"
                      >
                        <div className="px-4 py-2 border-b border-gray-50 dark:border-gray-800">
                          <p className="text-xs text-gray-400">Logged in as</p>
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>

                        <Link
                          to="/products"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <ShoppingBag size={14} /> My Orders
                        </Link>
                        
                        <Link
                          to="/wishlist"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <Heart size={14} /> Wishlist
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left border-t border-gray-50 dark:border-gray-800 mt-1"
                        >
                          <LogOut size={14} /> Log Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold shadow-sm transition-all duration-300"
                >
                  <User size={13} />
                  Login
                </Link>
              )}
            </div>

            {/* Hamburger Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="lg:hidden p-2.5 rounded-xl border border-transparent hover:border-gray-100 dark:hover:border-gray-800 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Floating Scroll Progress Script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          window.addEventListener('scroll', () => {
            const progress = document.getElementById('scroll-progress');
            if (progress) {
              const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
              const ratio = totalHeight > 0 ? (window.pageYOffset / totalHeight) : 0;
              progress.style.transform = 'scaleX(' + ratio + ')';
            }
          });
        `
      }} />

      {/* Mobile Drawer (Sidebar Menu) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto lg:hidden"
            >
              <div>
                {/* Header of Drawer */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                      <ShoppingBag size={16} />
                    </div>
                    <span className="text-base font-black tracking-tight text-gray-900 dark:text-white">
                      LUXE STORE
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close drawer"
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Mobile Search Bar */}
                <div className="mb-6 md:hidden">
                  <SearchBar onCloseMobile={() => setMobileMenuOpen(false)} />
                </div>

                {/* Mobile Links */}
                <nav className="flex flex-col gap-1.5" aria-label="Mobile Navigation">
                  <NavLink
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-colors ${
                        isActive
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50'
                      }`
                    }
                  >
                    <ShoppingBag size={15} /> Home
                  </NavLink>
                  <NavLink
                    to="/categories"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-colors ${
                        isActive
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50'
                      }`
                    }
                  >
                    <ChevronDown size={15} className="-rotate-90" /> Categories
                  </NavLink>
                  <NavLink
                    to="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-colors ${
                        isActive
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50'
                      }`
                    }
                  >
                    <Sparkles size={15} /> Products
                  </NavLink>
                  <NavLink
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-colors ${
                        isActive
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50'
                      }`
                    }
                  >
                    <Info size={15} /> About
                  </NavLink>
                  <NavLink
                    to="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-colors ${
                        isActive
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50'
                      }`
                    }
                  >
                    <Mail size={15} /> Contact
                  </NavLink>
                  <NavLink
                    to="/faq"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-colors ${
                        isActive
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
                          : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50'
                      }`
                    }
                  >
                    <HelpCircle size={15} /> FAQ
                  </NavLink>
                </nav>
              </div>

              {/* Bottom login profile action drawer */}
              <div className="pt-6 border-t border-gray-100 dark:border-gray-800 mt-6 space-y-4">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
                      <div className="h-9 w-9 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center">
                        {user?.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">{user?.name}</p>
                        <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-extrabold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/10 border border-transparent hover:border-rose-100"
                    >
                      <LogOut size={14} /> Log Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-3 px-4 rounded-xl text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2"
                    >
                      <User size={14} /> Log In
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
