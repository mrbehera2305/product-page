'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, clearCart } = useAuth();

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountSavings = cart.reduce((sum, item) => {
    const orig = item.product.price * item.quantity;
    const disc = (item.product.price * (1 - item.product.discount / 100)) * item.quantity;
    return sum + (orig - disc);
  }, 0);

  const netSubtotal = subtotal - discountSavings;
  const deliveryFee = netSubtotal >= 499 || cart.length === 0 ? 0 : 30;
  const finalTotal = netSubtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Explore our store catalog to add groceries, snacks & household essentials to your basket.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Shopping Cart</h1>
          <p className="text-xs text-slate-500">{cart.length} item(s) in your basket</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Empty Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => {
            const discountedPrice = (item.product.price * (1 - item.product.discount / 100)).toFixed(2);
            return (
              <div
                key={item.product._id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-xl object-cover border border-slate-100 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {item.product.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1 mt-0.5">
                    {item.product.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-black text-slate-900">₹{discountedPrice}</span>
                    {item.product.discount > 0 && (
                      <span className="text-xs text-slate-400 line-through">₹{item.product.price}</span>
                    )}
                  </div>
                </div>

                {/* Quantity modifier */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50">
                    <button
                      onClick={() => updateCartQuantity(item.product._id, item.quantity - 1)}
                      className="px-2.5 py-1 text-slate-600 font-bold hover:text-slate-900"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-800">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.product._id, item.quantity + 1)}
                      className="px-2.5 py-1 text-slate-600 font-bold hover:text-slate-900"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <Link href="/products" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline pt-2">
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary Box */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 h-fit">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">Order Summary</h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Total:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            {discountSavings > 0 && (
              <div className="flex justify-between text-rose-600 font-semibold">
                <span>Discount Savings:</span>
                <span>-₹{discountSavings.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee:</span>
              <span>{deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${deliveryFee}`}</span>
            </div>

            {netSubtotal < 499 && (
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-semibold">
                Add ₹{(499 - netSubtotal).toFixed(0)} more for FREE Delivery!
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-slate-900 font-black text-base">
              <span>Total Payable:</span>
              <span className="text-xl text-emerald-700">₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2 justify-center text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Pay securely via UPI QR Code</span>
          </div>
        </div>

      </div>

    </div>
  );
}
