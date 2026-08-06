'use client';

import React, { useEffect, useState } from 'react';
import { Order } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, CheckCircle2, XCircle, Clock, Truck, Eye, QrCode, Search, AlertCircle, X } from 'lucide-react';

export default function AdminOrdersPage() {
  const { showToast } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

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

  const handleUpdateStatus = async (orderId: string, paymentStatus?: string, orderStatus?: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentStatus,
          orderStatus,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast('Order status updated successfully', 'success');
        fetchOrders();
      } else {
        showToast(data.error || 'Failed to update order', 'error');
      }
    } catch (err) {
      showToast('Error updating order', 'error');
    }
  };

  const filteredOrders = orders.filter(o => {
    if (filterStatus === 'All') return true;
    if (filterStatus === 'Pending Verification') return o.paymentStatus === 'Pending Verification';
    if (filterStatus === 'Paid') return o.paymentStatus === 'Paid';
    if (filterStatus === 'Shipped') return o.orderStatus === 'Shipped';
    if (filterStatus === 'Delivered') return o.orderStatus === 'Delivered';
    return true;
  });

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Customer Order Management</h1>
          <p className="text-xs text-slate-400">Verify customer UPI payment screenshots & manage delivery workflow</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
          {['All', 'Pending Verification', 'Paid', 'Shipped', 'Delivered'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading order list...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 text-center text-slate-400 text-xs">
            No orders found under "{filterStatus}" filter.
          </div>
        ) : (
          filteredOrders.map(order => (
            <div
              key={order._id}
              className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-md space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-400 text-sm">#{order._id}</span>
                    <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Customer: <strong className="text-white">{order.userName}</strong> ({order.userEmail}) • Phone: <strong className="text-white">{order.shippingAddress.phone}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.paymentStatus === 'Paid'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    Payment: {order.paymentStatus}
                  </span>
                  <span className="text-lg font-black text-white">₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Items & Shipping Address Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
                
                {/* Items */}
                <div className="md:col-span-2 space-y-2">
                  <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Ordered Items ({order.items.length})</div>
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-850 p-2.5 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-2">
                          <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <div className="font-bold text-white max-w-[200px] truncate">{item.name}</div>
                            <div className="text-[10px] text-slate-400">Qty: {item.quantity} × ₹{item.discountPrice}</div>
                          </div>
                        </div>
                        <div className="font-bold text-emerald-400">₹{(item.quantity * item.discountPrice).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Proof & Address */}
                <div className="space-y-3 bg-slate-850 p-4 rounded-2xl border border-slate-800">
                  <div>
                    <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Delivery Address</div>
                    <div className="text-slate-300 font-semibold">{order.shippingAddress.fullName}</div>
                    <div className="text-slate-400 leading-snug">{order.shippingAddress.street}, {order.shippingAddress.city} - {order.shippingAddress.pincode}</div>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mb-1">Payment Proof Details</div>
                    {order.paymentDetails?.upiTransactionId ? (
                      <div className="font-mono bg-slate-900 p-2 rounded-xl border border-slate-700 text-emerald-400 font-bold flex items-center justify-between">
                        <span>UTR: {order.paymentDetails.upiTransactionId}</span>
                      </div>
                    ) : (
                      <div className="text-amber-400 italic text-[11px]">No UTR number submitted yet</div>
                    )}

                    {order.paymentDetails?.screenshotUrl && (
                      <button
                        onClick={() => setSelectedScreenshot(order.paymentDetails?.screenshotUrl || null)}
                        className="mt-2 w-full py-1.5 px-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Payment Screenshot
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* Action Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
                
                {/* Delivery Status Selector */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400">Order Progress:</span>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleUpdateStatus(order._id, undefined, e.target.value)}
                    className="bg-slate-850 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped / Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Quick Payment Approval Buttons */}
                <div className="flex items-center gap-2">
                  {order.paymentStatus !== 'Paid' && (
                    <button
                      onClick={() => handleUpdateStatus(order._id, 'Paid', 'Confirmed')}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve Payment
                    </button>
                  )}

                  {order.paymentStatus !== 'Rejected' && order.paymentStatus !== 'Paid' && (
                    <button
                      onClick={() => handleUpdateStatus(order._id, 'Rejected', undefined)}
                      className="px-3 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" /> Reject Payment
                    </button>
                  )}
                </div>

              </div>

            </div>
          ))
        )}
      </div>

      {/* Screenshot Zoom Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-slate-900 rounded-3xl p-4 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-white font-bold text-sm">
              <span>Customer Payment Proof Screenshot</span>
              <button onClick={() => setSelectedScreenshot(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto flex justify-center bg-slate-950 rounded-2xl p-2">
              <img src={selectedScreenshot} alt="Payment Proof" className="max-w-full h-auto rounded-xl" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
