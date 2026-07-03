/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from 'axios';
import { Product } from '../types';

const BASE_URL = 'https://dummyjson.com';

// Local cache for categories and products to optimize loading times
const apiCache: Record<string, any> = {};

export interface Category {
  slug: string;
  name: string;
}

export const apiService = {
  /**
   * Fetches all products (or a paginated list) from DummyJSON
   */
  async getProducts(limit = 100, skip = 0): Promise<{ products: Product[]; total: number }> {
    const cacheKey = `products_${limit}_${skip}`;
    if (apiCache[cacheKey]) {
      return apiCache[cacheKey];
    }

    try {
      const response = await axios.get(`${BASE_URL}/products`, {
        params: { limit, skip },
      });
      
      const data = response.data;
      // Cache results
      apiCache[cacheKey] = data;
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  /**
   * Fetches products in a specific category
   */
  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    const cacheKey = `category_products_${categorySlug}`;
    if (apiCache[cacheKey]) {
      return apiCache[cacheKey];
    }

    try {
      const response = await axios.get(`${BASE_URL}/products/category/${categorySlug}`);
      const data = response.data.products;
      apiCache[cacheKey] = data;
      return data;
    } catch (error) {
      console.error(`Error fetching products for category ${categorySlug}:`, error);
      throw error;
    }
  },

  /**
   * Fetches details of a single product
   */
  async getProductById(id: number): Promise<Product> {
    const cacheKey = `product_${id}`;
    if (apiCache[cacheKey]) {
      return apiCache[cacheKey];
    }

    try {
      const response = await axios.get(`${BASE_URL}/products/${id}`);
      const data = response.data;
      apiCache[cacheKey] = data;
      return data;
    } catch (error) {
      console.error(`Error fetching product details for ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Fetches the list of all categories, handling both string-array and object-array formats
   */
  async getCategories(): Promise<Category[]> {
    const cacheKey = 'categories_list';
    if (apiCache[cacheKey]) {
      return apiCache[cacheKey];
    }

    try {
      // Try fetching from standard categories list
      const response = await axios.get(`${BASE_URL}/products/categories`);
      const rawData = response.data;
      
      let formattedCategories: Category[] = [];
      
      if (Array.isArray(rawData)) {
        if (typeof rawData[0] === 'string') {
          // If array of strings: ["beauty", "fragrances", ...]
          formattedCategories = rawData.map((cat: string) => ({
            slug: cat,
            name: cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          }));
        } else if (typeof rawData[0] === 'object' && rawData[0] !== null) {
          // If array of objects: [{ slug: 'beauty', name: 'Beauty' }]
          formattedCategories = rawData.map((cat: any) => ({
            slug: cat.slug || cat.name?.toLowerCase() || '',
            name: cat.name || cat.slug || '',
          }));
        }
      }
      
      // Save in cache and return
      apiCache[cacheKey] = formattedCategories;
      return formattedCategories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback local category list to ensure the application never breaks
      const fallback: Category[] = [
        { slug: 'beauty', name: 'Beauty' },
        { slug: 'fragrances', name: 'Fragrances' },
        { slug: 'furniture', name: 'Furniture' },
        { slug: 'groceries', name: 'Groceries' },
        { slug: 'home-decoration', name: 'Home Decoration' },
        { slug: 'kitchen-accessories', name: 'Kitchen Accessories' },
        { slug: 'laptops', name: 'Laptops' },
        { slug: 'mens-shirts', name: 'Mens Shirts' },
        { slug: 'mens-shoes', name: 'Mens Shoes' },
        { slug: 'mens-watches', name: 'Mens Watches' },
        { slug: 'mobile-accessories', name: 'Mobile Accessories' },
        { slug: 'motorcycle', name: 'Motorcycle' },
        { slug: 'skin-care', name: 'Skin Care' },
        { slug: 'smartphones', name: 'Smartphones' },
        { slug: 'sports-accessories', name: 'Sports Accessories' },
        { slug: 'sunglasses', name: 'Sunglasses' },
        { slug: 'tablets', name: 'Tablets' },
        { slug: 'tops', name: 'Tops' },
        { slug: 'vehicle', name: 'Vehicle' },
        { slug: 'womens-bags', name: 'Womens Bags' },
        { slug: 'womens-dresses', name: 'Womens Dresses' },
        { slug: 'womens-jewellery', name: 'Womens Jewellery' },
        { slug: 'womens-shoes', name: 'Womens Shoes' },
        { slug: 'womens-watches', name: 'Womens Watches' }
      ];
      return fallback;
    }
  },

  /**
   * Search products by keyword
   */
  async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await axios.get(`${BASE_URL}/products/search`, {
        params: { q: query },
      });
      return response.data.products;
    } catch (error) {
      console.error(`Error searching products for query "${query}":`, error);
      throw error;
    }
  }
};
