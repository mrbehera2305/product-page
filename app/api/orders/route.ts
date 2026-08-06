import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { Order, OrderItem, ShippingAddress } from '@/lib/types';

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const store = getStore();
  let orders = store.orders;

  // If customer, show only their own orders. If admin, show all.
  if (auth.role !== 'admin') {
    orders = orders.filter(o => o.userId === auth.userId);
  }

  // Sort newest first
  orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) {
    return NextResponse.json({ error: 'Please log in to place an order' }, { status: 401 });
  }

  try {
    const { items, shippingAddress }: { items: OrderItem[]; shippingAddress: ShippingAddress } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street) {
      return NextResponse.json({ error: 'Shipping address details are incomplete' }, { status: 400 });
    }

    const store = getStore();

    // Verify stock and calculate totals
    let subtotal = 0;
    let discountSavings = 0;

    for (const item of items) {
      const product = store.products.find(p => p._id === item.productId);
      if (!product) {
        return NextResponse.json({ error: `Product ${item.name} is no longer available` }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name}. Available: ${product.stock}` }, { status: 400 });
      }

      const itemOriginalTotal = product.price * item.quantity;
      const itemDiscountedTotal = (product.price * (1 - product.discount / 100)) * item.quantity;

      subtotal += itemOriginalTotal;
      discountSavings += (itemOriginalTotal - itemDiscountedTotal);
    }

    const netSubtotal = subtotal - discountSavings;
    const deliveryFee = netSubtotal >= store.settings.freeDeliveryMinAmount ? 0 : store.settings.deliveryFee;
    const totalAmount = Number((netSubtotal + deliveryFee).toFixed(2));

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      _id: orderId,
      userId: auth.userId,
      userName: auth.name,
      userEmail: auth.email,
      items,
      shippingAddress,
      subtotal: Number(subtotal.toFixed(2)),
      discountSavings: Number(discountSavings.toFixed(2)),
      deliveryFee,
      totalAmount,
      paymentMethod: 'UPI_QR',
      paymentStatus: 'Pending Verification',
      orderStatus: 'Pending',
      createdAt: new Date().toISOString()
    };

    // Deduct stock
    for (const item of items) {
      const product = store.products.find(p => p._id === item.productId);
      if (product) {
        product.stock -= item.quantity;
      }
    }

    store.orders.unshift(newOrder);

    return NextResponse.json({
      message: 'Order created successfully. Please complete UPI payment.',
      order: newOrder
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
