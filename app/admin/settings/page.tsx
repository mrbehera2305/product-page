'use client';

import React, { useEffect, useState } from 'react';
import { StoreSettings } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { Settings, QrCode, Store, Phone, Mail, Upload, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const { showToast } = useAuth();
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data.settings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSettings({ ...settings, customQrImage: reader.result as string });
      showToast('Store QR Image uploaded', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (res.ok) {
        showToast('Store & UPI Settings updated successfully!', 'success');
        setSettings(data.settings);
      } else {
        showToast(data.error || 'Failed to save settings', 'error');
      }
    } catch (err) {
      showToast('Error saving store configuration', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="text-slate-400 py-12 text-center text-xs">Loading store settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-black text-white">Store & UPI QR Settings</h1>
        <p className="text-xs text-slate-400">Configure your store information, payment UPI ID, and inventory thresholds</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        
        {/* UPI QR Payment Configuration Box */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-emerald-900/50 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-emerald-400 font-bold text-sm">
            <QrCode className="w-5 h-5" />
            <span>Personal UPI Payment Gateway Configuration</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Store Payee UPI ID (VPA) *</label>
              <input
                type="text"
                required
                value={settings.upiId}
                onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                placeholder="e.g. yourname@upi or 9876543210@paytm"
                className="w-full p-3 font-mono bg-slate-850 border border-slate-700 rounded-xl text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">This UPI ID is encoded into the dynamic QR code generated at customer checkout.</p>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Merchant / Store Name on UPI App *</label>
              <input
                type="text"
                required
                value={settings.upiName}
                onChange={(e) => setSettings({ ...settings, upiName: e.target.value })}
                placeholder="QuickMart General Store"
                className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block font-bold text-slate-300">Custom Static Personal QR Image (Optional)</label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {settings.customQrImage && (
                  <img src={settings.customQrImage} alt="Uploaded QR" className="w-24 h-24 rounded-xl object-cover border border-slate-700" />
                )}
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={settings.customQrImage || ''}
                    onChange={(e) => setSettings({ ...settings, customQrImage: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-2.5 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white"
                  />
                  <label className="inline-flex cursor-pointer px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-emerald-400 font-bold text-xs items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Upload Personal QR Image
                    <input type="file" accept="image/*" onChange={handleCustomQrUpload} className="sr-only" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Store Business Profile */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-slate-200 font-bold text-sm">
            <Store className="w-5 h-5 text-emerald-400" />
            <span>Store Profile & Operating Details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">General Store Name *</label>
              <input
                type="text"
                required
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Owner / Merchant Name *</label>
              <input
                type="text"
                required
                value={settings.ownerName}
                onChange={(e) => setSettings({ ...settings, ownerName: e.target.value })}
                className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-300 mb-1">Physical Store Address</label>
              <textarea
                rows={2}
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Inventory & Delivery Rules */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-slate-200 font-bold text-sm">
            <Settings className="w-5 h-5 text-emerald-400" />
            <span>Inventory & Delivery Thresholds</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Low Stock Warning Threshold (units)</label>
              <input
                type="number"
                value={settings.lowStockThreshold}
                onChange={(e) => setSettings({ ...settings, lowStockThreshold: parseInt(e.target.value) || 5 })}
                className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Standard Delivery Fee (₹)</label>
              <input
                type="number"
                value={settings.deliveryFee}
                onChange={(e) => setSettings({ ...settings, deliveryFee: parseFloat(e.target.value) || 0 })}
                className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Min Order Amount for Free Delivery (₹)</label>
              <input
                type="number"
                value={settings.freeDeliveryMinAmount}
                onChange={(e) => setSettings({ ...settings, freeDeliveryMinAmount: parseFloat(e.target.value) || 0 })}
                className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Configurations...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
