'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AdminSidebar } from '@/components/AdminSidebar';
import { ShieldAlert, LogIn } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<{ lowStockCount: number; pendingOrders: number }>({
    lowStockCount: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminStats();
    }
  }, [user]);

  const fetchAdminStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats({
          lowStockCount: data.lowStockCount || 0,
          pendingOrders: data.pendingOrders || 0,
        });
      }
    } catch (e) {}
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading admin session...</div>;
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold">Admin Portal Access Restricted</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          You must be logged in with an administrator account to access the store backend management suite.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 mx-auto"
        >
          <LogIn className="w-4 h-4" /> Sign In as Admin
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      <AdminSidebar
        lowStockCount={stats.lowStockCount}
        pendingOrdersCount={stats.pendingOrders}
      />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
