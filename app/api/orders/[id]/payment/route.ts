import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuthUser(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { upiTransactionId, screenshotUrl } = await req.json();

  const store = getStore();
  const order = store.orders.find(o => o._id === params.id);

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  if (order.userId !== auth.userId && auth.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  order.paymentDetails = {
    upiTransactionId: upiTransactionId || order.paymentDetails?.upiTransactionId || '',
    screenshotUrl: screenshotUrl || order.paymentDetails?.screenshotUrl || '',
    paidAt: new Date().toISOString(),
  };

  order.paymentStatus = 'Pending Verification';

  return NextResponse.json({
    message: 'Payment verification details submitted successfully. Admin will verify shortly.',
    order
  });
}
