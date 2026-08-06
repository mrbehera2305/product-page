'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Order } from '@/lib/types';
import { CheckCircle2, Clock, Truck, Package, ShieldCheck, QrCode, ArrowLeft } from 'lucide-react';

export default function OrderTrackingDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      setOrder(data.order);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500">Loading tracking details...</div>;
  }

  if (!order) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500">Order not found</div>;
  }

  // Timeline Step Status computation
  const steps = [
    {
      title: 'Order Placed',
      description: 'Order created & waiting for payment verification',
      done: true,
      active: order.orderStatus === 'Pending' && order.paymentStatus !== 'Paid',
      icon: Package,
    },
    {
      title: 'Payment & Order Confirmed',
      description: 'Store admin verified UPI payment proof',
      done: order.paymentStatus === 'Paid' || order.orderStatus === 'Confirmed' || order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered',
      active: order.orderStatus === 'Confirmed',
      icon: CheckCircle2,
    },
    {
      title: 'Shipped / Out for Delivery',
      description: 'Items packed and dispatched with store delivery partner',
      done: order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered',
      active: order.orderStatus === 'Shipped',
      icon: Truck,
    },
    {
      title: 'Delivered',
      description: 'Items delivered to your doorstep',
      done: order.orderStatus === 'Delivered',
      active: order.orderStatus === 'Delivered',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Order #{order._id}
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Real-Time Order Tracking</h1>
        </div>
        <Link href="/orders" className="text-xs font-bold text-slate-600 hover:text-emerald-600 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
      </div>

      {/* Interactive Status Timeline */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Delivery Progress</h2>

        <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pl-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative">
                {/* Node icon */}
                <div
                  className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                    step.done
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                      : step.active
                      ? 'bg-white border-amber-500 text-amber-600 animate-pulse'
                      : 'bg-white border-slate-300 text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div>
                  <h3 className={`text-sm font-bold ${step.done ? 'text-slate-900' : 'text-slate-500'}`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Receipt Breakdown & Shipping Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Shipping Address */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Delivery Address</h3>
          <div className="text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800">{order.shippingAddress.fullName}</div>
            <div>Phone: {order.shippingAddress.phone}</div>
            <div>{order.shippingAddress.street}</div>
            <div>{order.shippingAddress.city}, {order.shippingAddress.pincode}</div>
            {order.shippingAddress.notes && (
              <div className="text-slate-400 italic pt-1">Note: "{order.shippingAddress.notes}"</div>
            )}
          </div>
        </div>

        {/* Payment & Receipt Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Payment & Verification Details</h3>
          <div className="text-xs space-y-1.5 text-slate-600">
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <strong className="text-slate-800">UPI QR Code</strong>
            </div>
            <div className="flex justify-between">
              <span>Payment Verification:</span>
              <strong className={order.paymentStatus === 'Paid' ? 'text-emerald-600 font-extrabold' : 'text-amber-600'}>
                {order.paymentStatus}
              </strong>
            </div>
            {order.paymentDetails?.upiTransactionId && (
              <div className="flex justify-between font-mono bg-slate-50 p-2 rounded-xl border border-slate-100">
                <span>UTR/Txn ID:</span>
                <span className="font-bold text-slate-900">{order.paymentDetails.upiTransactionId}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-100 flex justify-between font-black text-slate-900 text-sm">
              <span>Total Paid Amount:</span>
              <span className="text-emerald-700">₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {order.paymentStatus === 'Pending Verification' && (
            <Link
              href={`/payment/${order._id}`}
              className="mt-3 block text-center py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              Update Payment Proof / Screenshot
            </Link>
          )}
        </div>

      </div>

    </div>
  );
}
