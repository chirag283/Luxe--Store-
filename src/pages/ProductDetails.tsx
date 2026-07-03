/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Rating } from '../components/Rating';
import { SkeletonDetails, SkeletonGrid } from '../components/Loader';
import { ProductCard } from '../components/ProductCard';
import {
  ShoppingBag,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  RotateCcw,
  User,
  Star,
  ChevronRight,
  Info
} from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [selectedImg, setSelectedImg] = useState('');
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const { addToCart, toggleWishlist, isInWishlist, addToast } = useCart();

  // Scroll to top on mount / product change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    let active = true;
    const fetchFullDetails = async () => {
      setLoading(true);
      try {
        const item = await apiService.getProductById(productId);
        if (!active) return;
        setProduct(item);
        setSelectedImg(item.thumbnail || item.images[0]);
        setQuantity(1);

        // Fetch related products from category
        setRelatedLoading(true);
        try {
          const categoryProducts = await apiService.getProductsByCategory(item.category);
          if (active) {
            // Filter out current product and slice to top 4 related
            const filtered = categoryProducts.filter((p) => p.id !== item.id).slice(0, 4);
            setRelatedProducts(filtered);
          }
        } catch (relatedErr) {
          console.error('Failed to load related products:', relatedErr);
        } finally {
          if (active) setRelatedLoading(false);
        }

      } catch (err) {
        console.error('Error loading product details:', err);
        addToast('Failed to load product details.', 'error');
        navigate('/products');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchFullDetails();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading || !product) {
    return <SkeletonDetails />;
  }

  const isFav = isInWishlist(product.id);
  const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);
  const isOutOfStock = product.stock <= 0;

  const handleIncrement = () => {
    if (quantity < product.stock) setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Product URL copied to clipboard!', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16" id="product-details-page">
      
      {/* 1. BREADCRUMBS LEAF */}
      <nav className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link to="/products" className="hover:text-indigo-600 transition-colors">Products</Link>
        <ChevronRight size={12} />
        <Link to={`/products?category=${product.category}`} className="hover:text-indigo-600 transition-colors">
          {product.category.replace('-', ' ')}
        </Link>
        <ChevronRight size={12} />
        <span className="text-gray-900 dark:text-gray-300 truncate max-w-[150px]">{product.title}</span>
      </nav>

      {/* 2. MAIN LAYOUT (GALLERY + SPECS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Aspect: Image Gallery Column */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="aspect-square w-full rounded-3xl bg-gray-50 dark:bg-gray-900/20 p-8 border border-gray-100 dark:border-gray-800/40 flex items-center justify-center relative shadow-inner">
            <img
              src={selectedImg}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain"
            />
            {product.discountPercentage > 0 && (
              <div className="absolute top-5 left-5 bg-rose-600 text-white text-xs font-black uppercase px-3 py-1.5 rounded-full shadow-md">
                {Math.round(product.discountPercentage)}% Off
              </div>
            )}
          </div>

          {/* Gallery Carousel List */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 bg-gray-50 p-2 flex-shrink-0 transition-all ${
                    selectedImg === img
                      ? 'border-indigo-600 dark:border-indigo-400 scale-95 shadow-md'
                      : 'border-transparent hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <img src={img} alt={`Gallery ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Aspect: Purchase Details Column */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div>
            {/* Category / Brand / SKU Ribbon */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
              <span>{product.category.replace('-', ' ')}</span>
              <span>•</span>
              <span>{product.brand || 'Luxe Brands'}</span>
              <span>•</span>
              <span>SKU: {product.sku}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-snug mb-4">
              {product.title}
            </h1>

            {/* Rating and Availability */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Rating rating={product.rating} showText reviewsCount={product.reviews?.length || 12} size={15} />
              
              {isOutOfStock ? (
                <span className="text-xs font-extrabold text-rose-600 bg-rose-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
                  Out of Stock
                </span>
              ) : (
                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
                  In Stock ({product.stock} units available)
                </span>
              )}
            </div>

            {/* Price Presentation */}
            <div className="flex items-baseline gap-4 mb-6 bg-gray-50 dark:bg-gray-900/40 p-4.5 rounded-2xl border border-gray-100 dark:border-gray-800/40 shadow-sm">
              <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
                ${discountedPrice}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-base text-gray-400 dark:text-gray-500 line-through font-bold">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-6">
              {product.description}
            </p>

            {/* Extra Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-xl mt-0.5"><Truck size={16} /></div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">Shipping Details</h4>
                  <p className="text-[11px] text-gray-400">{product.shippingInformation || 'Dispatches within 24-48 hours.'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-xl mt-0.5"><ShieldCheck size={16} /></div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">Brand Warranty</h4>
                  <p className="text-[11px] text-gray-400">{product.warrantyInformation || '1-Year official manufacturer warranty.'}</p>
                </div>
              </div>

              {product.dimensions && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-xl mt-0.5"><Info size={16} /></div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">Dimensions</h4>
                    <p className="text-[11px] text-gray-400">
                      W: {product.dimensions.width}cm | H: {product.dimensions.height}cm | D: {product.dimensions.depth}cm
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-xl mt-0.5"><RotateCcw size={16} /></div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">Returns Policy</h4>
                  <p className="text-[11px] text-gray-400">{product.returnPolicy || '30-day hassle-free return policy.'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* BUY NOW / CART ACTIONS PANEL */}
          <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              {/* Quantity Changer */}
              <div className="flex items-center border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden h-12">
                <button
                  onClick={handleDecrement}
                  disabled={isOutOfStock || quantity <= 1}
                  className="px-4 h-full hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 disabled:opacity-40 transition-colors font-extrabold text-lg"
                >
                  -
                </button>
                <span className="px-5 text-sm font-bold text-gray-800 dark:text-gray-200 min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  disabled={isOutOfStock || quantity >= product.stock}
                  className="px-4 h-full hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 disabled:opacity-40 transition-colors font-extrabold text-lg"
                >
                  +
                </button>
              </div>

              {/* Wishlist Heart Action */}
              <button
                onClick={() => toggleWishlist(product)}
                aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
                className={`h-12 px-5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all duration-300 ${
                  isFav
                    ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40 text-rose-500'
                    : 'bg-white hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-gray-300'
                }`}
              >
                <Heart className="h-4.5 w-4.5" fill={isFav ? 'currentColor' : 'none'} />
                <span>{isFav ? 'Added to Wishlist' : 'Save Item'}</span>
              </button>

              {/* Share Action */}
              <button
                onClick={handleShare}
                aria-label="Share product link"
                className="h-12 w-12 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-all shadow-sm"
              >
                <Share2 size={16} />
              </button>
            </div>

            {/* Primary CTAs */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full flex items-center justify-center gap-2 h-13 rounded-2xl text-xs font-bold border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ShoppingBag size={15} />
                Add to Shopping Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full h-13 rounded-2xl text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
              >
                Order & Buy Now
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 3. USER REVIEWS */}
      <section className="border-t border-gray-100 dark:border-gray-800/80 pt-12 space-y-6">
        <h3 className="text-lg font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
          Product Reviews ({product.reviews?.length || 0})
        </h3>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews.map((rev, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-850 p-5 rounded-2xl shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-extrabold text-xs">
                      {rev.reviewerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-950 dark:text-white">{rev.reviewerName}</h4>
                      <p className="text-[9px] text-gray-400 font-medium">
                        {new Date(rev.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={11}
                        fill={i < rev.rating ? 'currentColor' : 'none'}
                        className={i < rev.rating ? 'stroke-amber-500' : 'text-gray-200 dark:text-gray-800'}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">No customer reviews yet. Be the first to write one!</p>
        )}
      </section>

      {/* 4. RELATED PRODUCTS */}
      <section className="border-t border-gray-100 dark:border-gray-800/80 pt-12 space-y-6">
        <div>
          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
            Related Luxury Products
          </h3>
          <p className="text-xs text-gray-400 mt-1">Other curated items you might be interested in</p>
        </div>

        {relatedLoading ? (
          <SkeletonGrid count={4} />
        ) : relatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">No related products found in this category.</p>
        )}
      </section>

    </div>
  );
};
