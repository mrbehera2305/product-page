'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { Heart, ShoppingBag, Star, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist } = useAuth();
  const isWishlisted = wishlist.includes(product._id);

  const discountedPrice = (product.price * (1 - product.discount / 100)).toFixed(2);
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <Link href={`/products/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md">
            -{product.discount}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product._id)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-md transition-all ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Stock Status Badge Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-slate-950 text-slate-200 font-semibold text-xs px-3 py-1.5 rounded-full border border-slate-700">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {product.category}
            </span>
            
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium text-slate-700">{product.rating || '4.8'}</span>
            </div>
          </div>

          <Link href={`/products/${product._id}`} className="group-hover:text-emerald-600 transition-colors">
            <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug mb-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div>
          {/* Low Stock Notice */}
          {isLowStock && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 mb-2">
              <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
              <span>Only {product.stock} left in stock!</span>
            </div>
          )}

          <div className="flex items-end justify-between gap-2 pt-2 border-t border-slate-100">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-slate-900">
                  ₹{discountedPrice}
                </span>
                {product.discount > 0 && (
                  <span className="text-xs text-slate-400 line-through">
                    ₹{product.price}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => addToCart(product)}
              disabled={isOutOfStock}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs shadow-sm transition-all ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
