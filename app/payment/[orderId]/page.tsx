'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Order, StoreSettings } from '@/lib/types';
import { DynamicUPIQR } from '@/components/DynamicUPIQR';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Upload, CheckCircle2, Clock, AlertCircle, ArrowLeft } from 'lucide-react';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const { showToast } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Payment form state
  const [upiTransactionId, setUpiTransactionId] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    fetchOrderAndSettings();
  }, [orderId]);

  const fetchOrderAndSettings = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) {
        setOrder(null);
        return;
      }
      const data = await res.json();
      setOrder(data.order);
      setSettings(data.settings);
      if (data.order?.paymentDetails?.upiTransactionId) {
        setUpiTransactionId(data.order.paymentDetails.upiTransactionId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotUrl(reader.result as string);
      showToast('Payment screenshot attached successfully', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!upiTransactionId.trim() && !screenshotUrl) {
      showToast('Please enter the UPI Transaction Ref ID or attach a screenshot', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/orders/${orderId}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          upiTransactionId: upiTransactionId.trim(),
          screenshotUrl
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSubmittedSuccess(true);
        showToast('Payment details submitted for verification!', 'success');
        fetchOrderAndSettings();
      } else {
        showToast(data.error || 'Failed to submit payment details', 'error');
      }
    } catch (err) {
      showToast('Error submitting payment proof', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="max-w-xl mx-auto px-4 py-16 text-center text-slate-500">Loading payment gateway...</div>;
  }

  if (!order || !settings) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
        <button onClick={() => router.push('/orders')} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">
          View My Orders
        </button>
      </div>
    );
  }

  const isVerified = order.paymentStatus === 'Paid';
  const isPendingVerification = order.paymentStatus === 'Pending Verification' && order.paymentDetails?.upiTransactionId;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Order #{order._id}
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">UPI QR Code Payment</h1>
        </div>

        <button onClick={() => router.push(`/orders/${order._id}`)} className="text-xs font-bold text-slate-600 hover:text-emerald-600 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Order Details
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Dynamic UPI QR Generator */}
        <DynamicUPIQR
          upiId={settings.upiId}
          upiName={settings.upiName}
          amount={order.totalAmount}
          orderId={order._id}
          customQrImage={settings.customQrImage}
        />

        {/* Right Column: Payment Verification Submission */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          
          {/* Status Badge */}
          {isVerified ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Payment Verified & Confirmed!</span>
              </div>
              <p className="text-xs text-emerald-700">
                Your payment of ₹{order.totalAmount.toFixed(2)} has been verified by the store admin. Your order is confirmed for delivery.
              </p>
            </div>
          ) : isPendingVerification ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>Verification Under Review</span>
              </div>
              <p className="text-xs text-amber-700">
                Payment details (UTR: <span className="font-mono font-bold">{order.paymentDetails?.upiTransactionId}</span>) submitted. The store owner will approve your order shortly.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Step 2: Submit Payment Details</span>
              </div>
              <p className="text-xs text-slate-500">
                After scanning and completing the transaction in your UPI app, enter your UPI Transaction Ref ID / UTR or attach screenshot below.
              </p>
            </div>
          )}

          {/* Payment Proof Form */}
          <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                UPI Reference / UTR Number / Transaction ID *
              </label>
              <input
                type="text"
                value={upiTransactionId}
                onChange={(e) => setUpiTransactionId(e.target.value)}
                placeholder="e.g. 329182749102 or UTR No."
                className="w-full p-3 font-mono text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Attach Payment Screenshot (Optional)
              </label>
              <div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-slate-300 border-dashed rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-6 w-6 text-slate-400" />
                  <div className="flex text-xs text-slate-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-bold text-emerald-600 hover:text-emerald-500 focus-within:outline-none">
                      <span>Upload file</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="sr-only" />
                    </label>
                    <p className="pl-1">or drag & drop</p>
                  </div>
                  <p className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 5MB</p>
                </div>
              </div>
              {screenshotUrl && (
                <div className="mt-2 relative rounded-xl overflow-hidden border border-slate-200">
                  <img src={screenshotUrl} alt="Attached screenshot" className="w-full h-32 object-cover" />
                  <span className="absolute bottom-2 right-2 bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-md font-bold">
                    Attached
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || isVerified}
              className={`w-full py-4 rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                isVerified
                  ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-98'
              }`}
            >
              <span>{submitting ? 'Submitting Details...' : 'Payment Completed - Submit for Verification'}</span>
            </button>
          </form>

          {/* Quick Steps */}
          <div className="border-t border-slate-100 pt-4 space-y-2 text-[11px] text-slate-400">
            <div className="font-bold text-slate-700">How payment verification works:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Scan the QR code with GPay, PhonePe, Paytm, or BHIM.</li>
              <li>Approve payment of ₹{order.totalAmount.toFixed(2)}.</li>
              <li>Copy the 12-digit UTR transaction ID from your payment receipt.</li>
              <li>Click "Payment Completed" above to notify the store owner.</li>
            </ol>
          </div>

        </div>

      </div>

    </div>
  );
}
