'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { ProductCard } from '@/components/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';

export default function WishlistPage() {
  const { user, wishlist } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlistProducts();
  }, [wishlist]);

  const fetchWishlistProducts = async () => {
    try {
      const res = await fetch('/api/wishlist');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <Heart className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Please Sign In to View Wishlist</h2>
        <p className="text-xs text-slate-500">Save your favorite grocery items and shop whenever you want.</p>
        <Link href="/login" className="inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm">
          Sign In Now
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">Loading wishlist...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
          <span>My Favorite Items & Wishlist</span>
        </h1>
        <p className="text-xs text-slate-500">{products.length} saved product(s)</p>
      </div>

      {products.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
          <Heart className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">Your Wishlist is Empty</h2>
          <p className="text-xs text-slate-500">Click the heart icon on any store item to save it here.</p>
          <Link href="/products" className="inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm">
            Browse Store Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
