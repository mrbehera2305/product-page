'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Settings, ArrowLeft, AlertTriangle } from 'lucide-react';

interface AdminSidebarProps {
  lowStockCount?: number;
  pendingOrdersCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  lowStockCount = 0,
  pendingOrdersCount = 0
}) => {
  const pathname = usePathname();

  const links = [
    {
      name: 'Overview & Sales',
      href: '/admin',
      icon: LayoutDashboard,
      badge: null
    },
    {
      name: 'Manage Products',
      href: '/admin/products',
      icon: Package,
      badge: lowStockCount > 0 ? (
        <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> {lowStockCount}
        </span>
      ) : null
    },
    {
      name: 'Manage Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
      badge: pendingOrdersCount > 0 ? (
        <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
          {pendingOrdersCount}
        </span>
      ) : null
    },
    {
      name: 'Store & UPI Settings',
      href: '/admin/settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] p-4 border-r border-slate-800 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Store Management
          </div>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md font-semibold'
                      : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store Front
        </Link>
      </div>
    </aside>
  );
};
