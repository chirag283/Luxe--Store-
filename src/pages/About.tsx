/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Truck, Sparkles, Award, Heart, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16" id="about-us-page">
      
      {/* Brand presentation Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-500/10 dark:bg-indigo-500/5 px-3.5 py-1.5 rounded-full border border-indigo-500/10">
            OUR STORY
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
            Crafting Premium Sourcing Experiences Since 2022.
          </h1>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            Luxe Store was established with a singular, clear vision: to democratize access to globally verified, genuine high-end lifestyle products. We believe that buying authentic tech, exquisite scents, and premium lifestyle accessories should be a smooth, completely trusted transaction.
          </p>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            By connecting directly with verified international distributors and sifting every catalog item through meticulous quality checks, we eliminate duplicates, counterfeits, and delays. We focus on visual elegance, tactile quality, and absolute transparency.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-indigo-600/10 transition-transform hover:-translate-y-0.5"
            >
              Browse Curated Catalog
            </Link>
          </div>
        </div>

        {/* Brand visual card representation */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm aspect-square bg-gradient-to-tr from-slate-100 to-indigo-50/50 dark:from-gray-900 dark:to-indigo-950/20 border border-gray-100 dark:border-gray-800 rounded-[3rem] p-8 shadow-xl flex items-center justify-center overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-2xl" />
            <div className="text-center space-y-3 relative z-10">
              <Award className="h-16 w-16 text-indigo-600 dark:text-indigo-400 mx-auto stroke-[1.25] animate-pulse" />
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Premium Grade Sourcing</h3>
              <p className="text-[11px] text-gray-400 max-w-[200px] mx-auto">100% Sourced, Handpicked & Authenticity Guaranteed.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Core values bento grid */}
      <section className="space-y-10 pt-10 border-t border-gray-100 dark:border-gray-900">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Our Sourcing Pillars</h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            These four strict foundational principles guide how we manage Luxe Store every day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-xl w-fit"><ShieldCheck size={20} /></div>
            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Strict Authenticity</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We operate verified direct channels with brands. No third-party marketplace noise, meaning zero counterfeits.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-xl w-fit"><Sparkles size={20} /></div>
            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Curated Catalog</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We do not list millions of bloated, low-quality listings. We only host vetted products with stellar reviews.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-xl w-fit"><Truck size={20} /></div>
            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Insured Delivery</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              All packaging and shipping procedures are filmed, insured, and tracked live by premier global logistics providers.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm space-y-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-xl w-fit"><Heart size={20} /></div>
            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">User Happiness</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Our support team consists of genuine product experts ready to assist with tech specs, sizing, or returns.
            </p>
          </div>
        </div>
      </section>

      {/* Trust stats row */}
      <section className="bg-gray-50 dark:bg-gray-950/20 rounded-[2.5rem] border border-gray-100 dark:border-gray-850 p-8 sm:p-12 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-1">
            <span className="block text-3xl font-black text-indigo-600 dark:text-indigo-400">18K+</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Happy Buyers</span>
          </div>
          <div className="space-y-1">
            <span className="block text-3xl font-black text-indigo-600 dark:text-indigo-400">100%</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vetted Genuine</span>
          </div>
          <div className="space-y-1">
            <span className="block text-3xl font-black text-indigo-600 dark:text-indigo-400">4.8★</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Average Score</span>
          </div>
          <div className="space-y-1">
            <span className="block text-3xl font-black text-indigo-600 dark:text-indigo-400">30 Min</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Support Response</span>
          </div>
        </div>
      </section>

    </div>
  );
};
