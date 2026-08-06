import React from 'react';
import Link from 'next/link';
import { Store, Phone, Mail, MapPin, QrCode, ShieldCheck, Truck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Store Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold">
                <Store className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">QuickMart</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your trusted neighborhood general store. Fresh groceries, essential household items, beverages & snacks delivered directly to your doorstep.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800/50">
                <QrCode className="w-3.5 h-3.5" /> Instant UPI QR Payments
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/products" className="hover:text-emerald-400 transition-colors">All Store Items</Link></li>
              <li><Link href="/products?category=Grocery+%26+Staples" className="hover:text-emerald-400 transition-colors">Grocery & Rice</Link></li>
              <li><Link href="/products?category=Dairy+%26+Bakery" className="hover:text-emerald-400 transition-colors">Fresh Dairy & Butter</Link></li>
              <li><Link href="/wishlist" className="hover:text-emerald-400 transition-colors">My Wishlist</Link></li>
              <li><Link href="/orders" className="hover:text-emerald-400 transition-colors">Order Status Tracking</Link></li>
            </ul>
          </div>

          {/* Admin & Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Customer Support</h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>support@quickmart.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Main Market Road, City Center</span>
              </li>
            </ul>
          </div>

          {/* Guarantee Badges */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Store Promise</h3>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-white">100% Genuine Products</div>
                <div className="text-[11px] text-slate-400">Directly sourced & quality verified</div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-3">
              <Truck className="w-6 h-6 text-teal-400 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-white">Same-Day Home Delivery</div>
                <div className="text-[11px] text-slate-400">Free delivery on orders above ₹499</div>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} QuickMart General Store. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-slate-400 hover:text-emerald-400 transition-colors">Admin Portal</Link>
            <span>•</span>
            <span className="text-slate-400">UPI Payment Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
