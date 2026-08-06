import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const store = getStore();
  const product = store.products.find(p => p._id === params.id);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  // Get reviews for this product
  const reviews = store.reviews.filter(r => r.productId === params.id);

  return NextResponse.json({ product, reviews });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
  }

  const store = getStore();
  const index = store.products.findIndex(p => p._id === params.id);

  if (index === -1) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const body = await req.json();
  const existing = store.products[index];

  const updated = {
    ...existing,
    name: body.name !== undefined ? body.name : existing.name,
    category: body.category !== undefined ? body.category : existing.category,
    price: body.price !== undefined ? Number(body.price) : existing.price,
    discount: body.discount !== undefined ? Number(body.discount) : existing.discount,
    description: body.description !== undefined ? body.description : existing.description,
    stock: body.stock !== undefined ? Number(body.stock) : existing.stock,
    image: body.image !== undefined ? body.image : existing.image,
    isFeatured: body.isFeatured !== undefined ? !!body.isFeatured : existing.isFeatured,
  };

  store.products[index] = updated;

  return NextResponse.json({ message: 'Product updated successfully', product: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
  }

  const store = getStore();
  const index = store.products.findIndex(p => p._id === params.id);

  if (index === -1) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  store.products.splice(index, 1);

  return NextResponse.json({ message: 'Product deleted successfully' });
}
