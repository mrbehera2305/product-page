import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) {
    return NextResponse.json({ wishlistProductIds: [] });
  }

  const store = getStore();
  const userWishlist = store.wishlists[auth.userId] || [];
  const products = store.products.filter(p => userWishlist.includes(p._id));

  return NextResponse.json({ wishlistProductIds: userWishlist, products });
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) {
    return NextResponse.json({ error: 'Please log in to manage your wishlist' }, { status: 401 });
  }

  const { productId } = await req.json();
  if (!productId) {
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
  }

  const store = getStore();
  if (!store.wishlists[auth.userId]) {
    store.wishlists[auth.userId] = [];
  }

  const list = store.wishlists[auth.userId];
  const index = list.indexOf(productId);

  let isWishlisted = false;
  if (index >= 0) {
    list.splice(index, 1);
    isWishlisted = false;
  } else {
    list.push(productId);
    isWishlisted = true;
  }

  return NextResponse.json({
    message: isWishlisted ? 'Added to wishlist' : 'Removed from wishlist',
    isWishlisted,
    wishlistProductIds: list
  });
}
