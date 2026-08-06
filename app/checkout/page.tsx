'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShippingAddress, OrderItem } from '@/lib/types';
import { Truck, QrCode, ShieldCheck, ArrowRight } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, cart, clearCart, showToast } = useAuth();

  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.address || '');
  const [city, setCity] = useState('City Center');
  const [state, setState] = useState('State');
  const [pincode, setPincode] = useState('110001');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountSavings = cart.reduce((sum, item) => {
    const orig = item.product.price * item.quantity;
    const disc = (item.product.price * (1 - item.product.discount / 100)) * item.quantity;
    return sum + (orig - disc);
  }, 0);
  const netSubtotal = subtotal - discountSavings;
  const deliveryFee = netSubtotal >= 499 || cart.length === 0 ? 0 : 30;
  const totalAmount = netSubtotal + deliveryFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showToast('Please log in to complete your checkout', 'error');
      router.push('/login');
      return;
    }

    if (!fullName || !phone || !street || !pincode) {
      showToast('Please fill in all required shipping address fields', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const orderItems: OrderItem[] = cart.map(item => ({
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        discountPrice: Number((item.product.price * (1 - item.product.discount / 100)).toFixed(2)),
        quantity: item.quantity,
        image: item.product.image
      }));

      const shippingAddress: ShippingAddress = {
        fullName,
        phone,
        street,
        city,
        state,
        pincode,
        notes
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress
        })
      });

      const data = await res.json();

      if (res.ok && data.order) {
        clearCart();
        showToast('Order created! Please scan the UPI QR code to complete payment.', 'success');
        router.push(`/payment/${data.order._id}`);
      } else {
        showToast(data.error || 'Failed to place order', 'error');
      }
    } catch (err) {
      showToast('Error creating order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Your Cart is Empty</h2>
        <button onClick={() => router.push('/products')} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">
          Shop Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <h1 className="text-2xl font-black text-slate-900">Delivery Address & Checkout</h1>
        <p className="text-xs text-slate-500">Provide your shipping address details to proceed to UPI QR payment</p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Shipping Form */}
        <div className="lg:col-span-2 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-bold text-slate-900">
            <Truck className="w-5 h-5 text-emerald-600" />
            <span>Shipping Address Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Receiver name"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mobile Phone Number *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Street Address / House No / Apartment *</label>
              <textarea
                required
                rows={2}
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Flat No, Building Name, Landmark..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">City / Town *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Pincode *</label>
              <input
                type="text"
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Delivery Instructions (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Leave with watchman, call before arriving..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Checkout Payable Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 h-fit">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-bold text-slate-900">
            <QrCode className="w-5 h-5 text-emerald-600" />
            <span>Payable Summary</span>
          </div>

          <div className="space-y-2 text-xs">
            {cart.map(item => (
              <div key={item.product._id} className="flex justify-between items-center text-slate-700 py-1">
                <span className="truncate max-w-[180px]">{item.quantity}x {item.product.name}</span>
                <span className="font-bold text-slate-900">
                  ₹{((item.product.price * (1 - item.product.discount / 100)) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>₹{netSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Charge:</span>
              <span>{deliveryFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${deliveryFee}`}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900 text-sm">
              <span>Total Payable Amount:</span>
              <span className="text-lg text-emerald-700">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{submitting ? 'Generating Order...' : 'Proceed to UPI Payment'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 justify-center text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Personal Store UPI QR Code Displayed Next</span>
          </div>
        </div>

      </form>

    </div>
  );
}
