/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions?: ProductDimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus: string;
  reviews?: Review[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: ProductMeta;
  images: string[];
  thumbnail: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingAddress: {
    fullName: string;
    addressLine: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  billingAddress: {
    fullName: string;
    addressLine: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
  couponCode?: string;
  discountAmount: number;
  shippingCost: number;
  taxAmount: number;
  subtotal: number;
  grandTotal: number;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
}
