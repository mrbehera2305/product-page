'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Order } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { Package, Clock, CheckCircle2, Truck, QrCode, ArrowRight } from 'lucide-react';

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Order['orderStatus'], paymentStatus: Order['paymentStatus']) => {
    if (paymentStatus === 'Paid' && status === 'Delivered') {
      return (
        <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
        </span>
      );
    }
    if (status === 'Shipped') {
      return (
        <span className="bg-sky-100 text-sky-800 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
          <Truck className="w-3.5 h-3.5" /> Out for Delivery
        </span>
      );
    }
    if (paymentStatus === 'Paid' || status === 'Confirmed') {
      return (
        <span className="bg-teal-100 text-teal-800 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
        </span>
      );
    }
    return (
      <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
        <Clock className="w-3.5 h-3.5" /> Pending Verification
      </span>
    );
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500">Loading order history...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div>
        <h1 className="text-2xl font-black text-slate-900">My Orders & Status Tracking</h1>
        <p className="text-xs text-slate-500">View real-time status of your store orders and payment approvals</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">No Orders Found</h2>
          <p className="text-xs text-slate-500">You haven't placed any store orders yet.</p>
          <Link href="/products" className="inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Order #{order._id}
                  </span>
                  <span className="text-xs text-slate-400 ml-3">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.orderStatus, order.paymentStatus)}
                  <span className="text-base font-black text-slate-900">₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="flex items-center gap-3 overflow-x-auto py-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100 shrink-0">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="text-xs">
                      <div className="font-bold text-slate-800 max-w-[140px] truncate">{item.name}</div>
                      <div className="text-[10px] text-slate-500">{item.quantity}x • ₹{item.discountPrice}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs font-bold">
                <div className="text-slate-500">
                  Payment Status: <strong className="text-slate-800">{order.paymentStatus}</strong>
                </div>

                <div className="flex items-center gap-2">
                  {order.paymentStatus === 'Pending Verification' && (
                    <Link
                      href={`/payment/${order._id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5" /> Upload Payment Proof
                    </Link>
                  )}
                  
                  <Link
                    href={`/orders/${order._id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1"
                  >
                    <span>Track Order Status</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
