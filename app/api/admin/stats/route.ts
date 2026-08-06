import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
  }

  const store = getStore();

  const totalProducts = store.products.length;
  const totalOrders = store.orders.length;
  const pendingOrders = store.orders.filter(o => o.orderStatus === 'Pending' || o.paymentStatus === 'Pending Verification').length;
  const totalRevenue = store.orders
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const lowStockThreshold = store.settings.lowStockThreshold || 10;
  const lowStockProducts = store.products.filter(p => p.stock <= lowStockThreshold);

  return NextResponse.json({
    totalRevenue: Number(totalRevenue.toFixed(2)),
    totalOrders,
    pendingOrders,
    totalProducts,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
    recentOrders: store.orders.slice(0, 5),
    settings: store.settings
  });
}
