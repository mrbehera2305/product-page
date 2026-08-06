import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { Review } from '@/lib/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');
  const store = getStore();

  let reviews = store.reviews;
  if (productId) {
    reviews = reviews.filter(r => r.productId === productId);
  }

  return NextResponse.json({ reviews });
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) {
    return NextResponse.json({ error: 'Please log in to leave a review' }, { status: 401 });
  }

  const { productId, rating, comment } = await req.json();

  if (!productId || !rating || !comment) {
    return NextResponse.json({ error: 'Product ID, rating, and comment are required' }, { status: 400 });
  }

  const store = getStore();
  const product = store.products.find(p => p._id === productId);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const newReview: Review = {
    _id: `rev_${Date.now()}`,
    productId,
    userId: auth.userId,
    userName: auth.name,
    rating: Number(rating),
    comment,
    createdAt: new Date().toISOString()
  };

  store.reviews.unshift(newReview);

  // Recalculate product rating
  const prodReviews = store.reviews.filter(r => r.productId === productId);
  const avgRating = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
  product.rating = Number(avgRating.toFixed(1));
  product.numReviews = prodReviews.length;

  return NextResponse.json({ message: 'Review added successfully', review: newReview, productRating: product.rating });
}
