/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, ToastMessage } from '../types';

interface CartContextType {
  cart: CartItem[];
  wishlist: Product[];
  toasts: ToastMessage[];
  appliedCoupon: string | null;
  discountPercentage: number;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  taxAmount: number;
  grandTotal: number;
  
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  
  addToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cart state persisted in localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('shopping_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist state persisted in localStorage
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('user_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Coupon
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(() => {
    return localStorage.getItem('applied_coupon') || null;
  });
  const [discountPercentage, setDiscountPercentage] = useState<number>(() => {
    const pct = localStorage.getItem('discount_percentage');
    return pct ? parseFloat(pct) : 0;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('shopping_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('user_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Toast utilities
  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        if (newQty > product.stock) {
          addToast(`Only ${product.stock} units available in stock.`, 'error');
          updated[existingIndex].quantity = product.stock;
        } else {
          updated[existingIndex].quantity = newQty;
          addToast(`Updated quantity of ${product.title} in cart!`, 'success');
        }
        return updated;
      } else {
        if (quantity > product.stock) {
          addToast(`Only ${product.stock} units available. Added ${product.stock} units.`, 'info');
          return [...prevCart, { product, quantity: product.stock }];
        }
        addToast(`Added ${product.title} to your cart!`, 'success');
        return [...prevCart, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    if (item) {
      addToast(`Removed ${item.product.title} from cart.`, 'info');
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.product.id === productId);
      if (!item) return prevCart;
      
      if (quantity > item.product.stock) {
        addToast(`Only ${item.product.stock} items in stock.`, 'error');
        quantity = item.product.stock;
      }

      return prevCart.map((i) => (i.product.id === productId ? { ...i, quantity } : i));
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('shopping_cart');
  };

  // Wishlist operations
  const addToWishlist = (product: Product) => {
    if (!wishlist.some((item) => item.id === product.id)) {
      setWishlist((prev) => [...prev, product]);
      addToast(`Added ${product.title} to Wishlist!`, 'success');
    }
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
    addToast(`Removed item from Wishlist.`, 'info');
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Coupons
  const applyCoupon = async (code: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const normalized = code.trim().toUpperCase();
    let discount = 0;

    if (normalized === 'SAVE10') {
      discount = 10;
    } else if (normalized === 'SAVE20') {
      discount = 20;
    } else if (normalized === 'FREESHIP') {
      discount = 5; // Extra 5% off + we'll can apply it
    } else if (normalized === 'WELCOME50') {
      discount = 50;
    } else {
      addToast('Invalid coupon code.', 'error');
      return false;
    }

    setAppliedCoupon(normalized);
    setDiscountPercentage(discount);
    localStorage.setItem('applied_coupon', normalized);
    localStorage.setItem('discount_percentage', discount.toString());
    addToast(`Coupon "${normalized}" applied successfully! ${discount}% OFF!`, 'success');
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountPercentage(0);
    localStorage.removeItem('applied_coupon');
    localStorage.removeItem('discount_percentage');
    addToast('Coupon code removed.', 'info');
  };

  // Calculations
  const subtotal = cart.reduce((total, item) => {
    // Check if the item has discount
    const currentPrice = item.product.price;
    return total + currentPrice * item.quantity;
  }, 0);

  const discountAmount = parseFloat(((subtotal * discountPercentage) / 100).toFixed(2));
  
  // Shipping: Free for orders above $150 (after coupon discount), or if appliedCoupon is FREESHIP
  const postDiscountSubtotal = subtotal - discountAmount;
  const shippingCost = postDiscountSubtotal > 150 || appliedCoupon === 'FREESHIP' || cart.length === 0 ? 0 : 15;
  
  const taxAmount = parseFloat(((postDiscountSubtotal * 8.5) / 100).toFixed(2));
  
  const grandTotal = parseFloat((postDiscountSubtotal + shippingCost + taxAmount).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        toasts,
        appliedCoupon,
        discountPercentage,
        subtotal,
        discountAmount,
        shippingCost,
        taxAmount,
        grandTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        applyCoupon,
        removeCoupon,
        addToast,
        removeToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
