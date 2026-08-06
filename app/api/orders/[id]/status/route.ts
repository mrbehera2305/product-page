import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
  }

  const { orderStatus, paymentStatus, rejectionReason } = await req.json();

  const store = getStore();
  const order = store.orders.find(o => o._id === params.id);

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  if (orderStatus) {
    order.orderStatus = orderStatus;
  }

  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
    if (paymentStatus === 'Paid') {
      if (!order.paymentDetails) {
        order.paymentDetails = {};
      }
      order.paymentDetails.verifiedAt = new Date().toISOString();
      if (order.orderStatus === 'Pending') {
        order.orderStatus = 'Confirmed';
      }
    } else if (paymentStatus === 'Rejected') {
      if (!order.paymentDetails) {
        order.paymentDetails = {};
      }
      order.paymentDetails.rejectionReason = rejectionReason || 'Payment screenshot/UTR mismatch';
    }
  }

  order.updatedAt = new Date().toISOString();

  return NextResponse.json({ message: 'Order status updated successfully', order });
}
