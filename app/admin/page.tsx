'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product, Order } from '@/lib/types';
import { DollarSign, ShoppingCart, AlertTriangle, Package, Clock, ArrowRight, CheckCircle2, QrCode } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-slate-400 py-12 text-center text-sm">Loading store analytics...</div>;
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Admin Dashboard</h1>
          <p className="text-xs text-slate-400">General Store performance, sales summary & low stock alerts</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
          >
            + Add Product
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            Verify Orders
          </Link>
        </div>
      </div>

      {/* Low Stock Warning Banner */}
      {stats?.lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/80 border border-amber-800/80 text-amber-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-900/90 text-amber-300">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold">Low Stock Warning ({stats.lowStockCount} Products)</div>
              <p className="text-xs text-amber-300/80">Some items have fallen below your store's threshold count.</p>
            </div>
          </div>
          <Link
            href="/admin/products"
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-colors shrink-0"
          >
            Restock Now
          </Link>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Revenue */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Sales Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">₹{stats?.totalRevenue?.toFixed(2) || '0.00'}</div>
          <div className="text-[11px] text-emerald-400 font-semibold">Verified UPI Payments</div>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Customer Orders</span>
            <div className="p-2 rounded-xl bg-teal-950 text-teal-400">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats?.totalOrders || 0}</div>
          <div className="text-[11px] text-slate-400">All customer orders</div>
        </div>

        {/* Pending Verifications */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Pending Verifications</span>
            <div className="p-2 rounded-xl bg-rose-950 text-rose-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-400">{stats?.pendingOrders || 0}</div>
          <div className="text-[11px] text-rose-300">Requires UPI proof check</div>
        </div>

        {/* Total Products */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Catalog Products</span>
            <div className="p-2 rounded-xl bg-sky-950 text-sky-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats?.totalProducts || 0}</div>
          <div className="text-[11px] text-slate-400">Active store inventory</div>
        </div>

      </div>

      {/* Recent Orders Section */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <QrCode className="w-4 h-4 text-emerald-400" /> Recent Customer Orders & Payments
          </h2>
          <Link href="/admin/orders" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
            <span>Manage All Orders</span> <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-850 text-slate-400 uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Payment Status</th>
                <th className="p-3">Order Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {stats?.recentOrders?.map((ord: Order) => (
                <tr key={ord._id} className="hover:bg-slate-850/50">
                  <td className="p-3 font-mono font-bold text-emerald-400">#{ord._id}</td>
                  <td className="p-3 font-semibold text-white">{ord.userName}</td>
                  <td className="p-3 font-black text-white">₹{ord.totalAmount.toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      ord.paymentStatus === 'Paid' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full text-[10px] font-semibold">
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href="/admin/orders"
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] transition-colors"
                    >
                      Inspect & Verify
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
