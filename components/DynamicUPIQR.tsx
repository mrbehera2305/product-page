'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Smartphone, Copy, Check, ExternalLink } from 'lucide-react';

interface DynamicUPIQRProps {
  upiId: string;
  upiName: string;
  amount: number;
  orderId: string;
  customQrImage?: string;
}

export const DynamicUPIQR: React.FC<DynamicUPIQRProps> = ({
  upiId,
  upiName,
  amount,
  orderId,
  customQrImage
}) => {
  const [qrCanvasUrl, setQrCanvasUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'dynamic' | 'custom'>('dynamic');

  // Format exact UPI link: upi://pay?pa=upiId&pn=upiName&am=amount&tn=Order%20orderId&cu=INR
  const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${amount.toFixed(2)}&tn=${encodeURIComponent(`QuickMart Order ${orderId}`)}&cu=INR`;

  useEffect(() => {
    QRCode.toDataURL(upiLink, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then(url => setQrCanvasUrl(url))
      .catch(err => console.error('Error generating UPI QR code', err));
  }, [upiLink]);

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 flex flex-col items-center text-center">
      
      {/* Header Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-4">
        <QrCode className="w-3.5 h-3.5" /> Scan & Pay via any UPI App
      </div>

      {/* Switcher if store owner uploaded a static QR */}
      {customQrImage && (
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold mb-4 w-full max-w-xs">
          <button
            type="button"
            onClick={() => setMode('dynamic')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              mode === 'dynamic' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Dynamic Auto Amount QR
          </button>
          <button
            type="button"
            onClick={() => setMode('custom')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              mode === 'custom' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Personal Store QR
          </button>
        </div>
      )}

      {/* QR Code Container */}
      <div className="relative bg-white p-3 rounded-2xl border-2 border-emerald-500/30 shadow-inner group">
        {mode === 'dynamic' ? (
          qrCanvasUrl ? (
            <img src={qrCanvasUrl} alt="UPI QR Code" className="w-56 h-56 object-contain rounded-lg" />
          ) : (
            <div className="w-56 h-56 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400">
              Generating Dynamic QR...
            </div>
          )
        ) : (
          <img src={customQrImage} alt="Store Personal QR Code" className="w-56 h-56 object-cover rounded-lg" />
        )}
      </div>

      {/* Total Amount Banner */}
      <div className="mt-4 bg-slate-900 text-white w-full py-3 px-4 rounded-xl flex items-center justify-between">
        <span className="text-xs font-medium text-slate-300">Payable Amount:</span>
        <span className="text-xl font-black text-emerald-400">₹{amount.toFixed(2)}</span>
      </div>

      {/* Store UPI Details & Copy Button */}
      <div className="mt-4 w-full text-left bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-1">Payee UPI ID</div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-sm font-bold text-slate-800 break-all">{upiId}</span>
          <button
            onClick={copyUpiId}
            className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg transition-colors shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        <div className="text-xs text-slate-500 mt-1">Merchant: <strong className="text-slate-700">{upiName}</strong></div>
      </div>

      {/* Mobile App Deep Links */}
      <div className="mt-5 w-full">
        <div className="text-xs font-bold text-slate-500 mb-2 flex items-center justify-center gap-1">
          <Smartphone className="w-3.5 h-3.5" /> Tap to Open Installed UPI App
        </div>
        <div className="grid grid-cols-3 gap-2">
          <a
            href={upiLink}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 transition-all group"
          >
            <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">Google Pay</span>
            <ExternalLink className="w-3 h-3 text-slate-400 mt-0.5" />
          </a>
          <a
            href={upiLink}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-100 hover:bg-purple-50 hover:border-purple-300 border border-slate-200 transition-all group"
          >
            <span className="text-xs font-bold text-slate-800 group-hover:text-purple-700">PhonePe</span>
            <ExternalLink className="w-3 h-3 text-slate-400 mt-0.5" />
          </a>
          <a
            href={upiLink}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-100 hover:bg-sky-50 hover:border-sky-300 border border-slate-200 transition-all group"
          >
            <span className="text-xs font-bold text-slate-800 group-hover:text-sky-700">Paytm / BHIM</span>
            <ExternalLink className="w-3 h-3 text-slate-400 mt-0.5" />
          </a>
        </div>
      </div>

    </div>
  );
};
