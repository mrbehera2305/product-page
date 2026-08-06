'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { ShoppingBag, Sparkles, Flame, ShieldCheck, QrCode, Truck, ArrowRight, Tag } from 'lucide-react';

const CATEGORIES = [
  { name: 'All Products', icon: '🛒', query: '' },
  { name: 'Grocery & Staples', icon: '🌾', query: 'Grocery+%26+Staples' },
  { name: 'Dairy & Bakery', icon: '🥛', query: 'Dairy+%26+Bakery' },
  { name: 'Beverages', icon: '🧃', query: 'Beverages' },
  { name: 'Snacks & Sweets', icon: '🍫', query: 'Snacks+%26+Sweets' },
  { name: 'Personal Care', icon: '🧴', query: 'Personal+Care' },
  { name: 'Household & Cleaning', icon: '🧹', query: 'Household+%26+Cleaning' },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const featuredProducts = products.filter(p => p.isFeatured);
  const discountedProducts = products.filter(p => p.discount > 0);

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 opacity-90" />
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Your Trusted Local General Store</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Fresh Groceries & <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Daily Essentials
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Order wheat flour, cooking oils, fresh dairy, chocolates & soaps. Fast local delivery with seamless <strong className="text-white font-semibold">UPI QR Code</strong> scanning.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/products"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 group"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop Catalog Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/products?category=Grocery+%26+Staples"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm transition-all text-center"
              >
                Browse Groceries
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 max-w-md mx-auto lg:mx-0">
              <div>
                <div className="text-xl font-bold text-emerald-400">100%</div>
                <div className="text-xs text-slate-400">Authentic Goods</div>
              </div>
              <div>
                <div className="text-xl font-bold text-teal-400">Fast</div>
                <div className="text-xs text-slate-400">Doorstep Delivery</div>
              </div>
              <div>
                <div className="text-xl font-bold text-emerald-400">UPI QR</div>
                <div className="text-xs text-slate-400">Instant Verification</div>
              </div>
            </div>
          </div>

          {/* Hero Visual Collage */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md bg-gradient-to-b from-slate-800/80 to-slate-900/90 rounded-3xl p-6 border border-slate-700/80 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Featured Items</span>
                <span className="text-xs text-slate-400">Fresh Stock</span>
              </div>

              <div className="space-y-3">
                {products.slice(0, 3).map(p => (
                  <div key={p._id} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">{p.name}</div>
                      <div className="text-[11px] text-slate-400">{p.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-400">₹{(p.price * (1 - p.discount/100)).toFixed(0)}</div>
                      {p.discount > 0 && <div className="text-[10px] text-rose-400 font-bold">-{p.discount}%</div>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-between text-xs text-emerald-300">
                <span className="flex items-center gap-1.5"><QrCode className="w-4 h-4 text-emerald-400" /> UPI QR Code Payment</span>
                <span className="font-bold text-white">Scan & Pay</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Explore Store Categories</span>
          </h2>
          <Link href="/products" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
            <span>View All</span> <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-none">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.name}
              href={cat.query ? `/products?category=${cat.query}` : '/products'}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all shrink-0 group"
            >
              <span className="text-lg">{cat.icon}</span>
              <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-700 whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Special Offers & Discounts Carousel Section */}
      {discountedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-emerald-500/10 rounded-3xl p-6 sm:p-8 border border-amber-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-100 px-2.5 py-0.5 rounded-full mb-1">
                  <Flame className="w-3.5 h-3.5 fill-rose-600" /> Hot Discount Deals
                </div>
                <h2 className="text-2xl font-black text-slate-900">Save Big on Daily Essentials</h2>
              </div>
              <Link href="/products" className="text-xs font-bold text-slate-800 hover:text-emerald-700 flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                <span>View Deals</span> <Tag className="w-3.5 h-3.5 text-rose-500" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {discountedProducts.slice(0, 4).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Catalog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Popular General Store Products</h2>
            <p className="text-xs text-slate-500">Handpicked items stocked for your daily home needs</p>
          </div>
          <Link
            href="/products"
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            See All Products
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-slate-100 animate-pulse h-72 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Authentic Quality</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Directly packed and quality verified products from official distributors.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Dynamic UPI QR Code</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Scan with GPay, PhonePe, Paytm or BHIM for instant transaction verification.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Local Doorstep Delivery</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Enjoy fast delivery to your home with real-time order tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
