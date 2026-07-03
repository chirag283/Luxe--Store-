/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(1);

  const faqs: FAQItem[] = [
    {
      id: 1,
      category: 'Sourcing & Authenticity',
      question: 'How do I know the luxury products are genuine?',
      answer: 'Luxe Store operates strictly through verified direct channels with brands and certified global distributors. We do not support unvetted third-party sellers on our platform. This eliminates duplicates, counterfeits, and catalog bloating, ensuring 100% authenticity on all smart tech, cosmetics, and perfumes.',
    },
    {
      id: 2,
      category: 'Shipping & Delivery',
      question: 'What are your delivery timelines and rates?',
      answer: 'We provide free premium tracked shipping on all orders over $150. For orders under $150, a flat shipping fee of $15 is applied. Packages are dispatched from our New York logistics hub within 24 to 48 hours. Standard domestic delivery takes 2 to 4 business days, and international shipping ranges from 5 to 9 business days.',
    },
    {
      id: 3,
      category: 'Discount Codes',
      question: 'How do I use a coupon code (such as WELCOME50)?',
      answer: 'After selecting your items and proceeding to the "Shopping Cart" page, locate the "Enter Coupon Code" input field in the Order Summary side panel. Type or paste your code (e.g. WELCOME50 for 50% off or SAVE20 for 20% off), tap "Apply", and the cost deduction will be calculated instantly before you checkout.',
    },
    {
      id: 4,
      category: 'Returns & Refunds',
      question: 'What is your returns policy?',
      answer: 'We offer a 30-day hassle-free return policy. If you are not completely satisfied with your purchase, you can log a return ticket via our Contact Page. Provided the product remains sealed, unused, and in its original premium packaging, we will dispatch a pre-paid return label and process a full refund upon receipt.',
    },
    {
      id: 5,
      category: 'Warranty & Support',
      question: 'Do products come with a manufacturer warranty?',
      answer: 'Yes. All consumer electronics, smartphones, and laptops listed on Luxe Store are covered by a 1-Year official manufacturer warranty. Scents, cosmetics, and furniture items are protected against logistical defects or damages. Warranty documents and receipt invoices are sent automatically to your registered email.',
    }
  ];

  const handleToggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12 animate-fade-in" id="faq-page">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <HelpCircle className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto stroke-[1.25]" />
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-gray-500 max-w-lg mx-auto">
          Need clear, instant information? We have compiled detailed explanations regarding product verification, shipping costs, return policies, and discount applications.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              id={`faq-item-${faq.id}`}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => handleToggle(faq.id)}
                className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">
                    {faq.category}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-gray-400 flex-shrink-0 mt-3 transform transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Animated/collapsible container */}
              <div
                className={`transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[200px] border-t border-gray-50 dark:border-gray-850 p-5 sm:p-6 bg-gray-50/30 dark:bg-gray-950/10' : 'max-h-0 opacity-0 pointer-events-none'
                }`}
              >
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300 font-medium">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Still need help helper box */}
      <div className="bg-indigo-50/20 border border-indigo-100/30 rounded-[2rem] p-8 text-center space-y-4">
        <MessageSquare className="h-8 w-8 text-indigo-600 mx-auto" />
        <h3 className="text-sm font-black text-gray-900 dark:text-white">Still Have Questions?</h3>
        <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
          If you can't find an answer to your exact question, our dedicated customer experts are available to help.
        </p>
        <div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 transition-transform hover:-translate-y-0.5"
          >
            Contact Customer Support
          </Link>
        </div>
      </div>

    </div>
  );
};
