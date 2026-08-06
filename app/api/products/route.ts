import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { Product } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const store = getStore();
    const { searchParams } = new URL(req.url);

    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort'); // price_asc, price_desc, rating, newest

    let result = [...store.products];

    if (category && category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const query = search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    if (minPrice) {
      result = result.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      result = result.filter(p => p.price <= parseFloat(maxPrice));
    }

    if (inStock === 'true') {
      result = result.filter(p => p.stock > 0);
    }

    if (featured === 'true') {
      result = result.filter(p => p.isFeatured);
    }

    // Sorting
    if (sort === 'price_asc') {
      result.sort((a, b) => (a.price * (1 - a.discount / 100)) - (b.price * (1 - b.discount / 100)));
    } else if (sort === 'price_desc') {
      result.sort((a, b) => (b.price * (1 - b.discount / 100)) - (a.price * (1 - a.discount / 100)));
    } else if (sort === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    return NextResponse.json({
      products: result,
      total: result.length,
      categories: Array.from(new Set(store.products.map(p => p.category)))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { name, category, price, discount, description, stock, image, isFeatured } = body;

    if (!name || !category || price === undefined || stock === undefined) {
      return NextResponse.json({ error: 'Name, category, price, and stock are required' }, { status: 400 });
    }

    const store = getStore();
    const newProduct: Product = {
      _id: `prod_${Date.now()}`,
      name,
      category,
      price: Number(price),
      discount: Number(discount) || 0,
      description: description || '',
      stock: Number(stock),
      image: image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
      rating: 5.0,
      numReviews: 0,
      isFeatured: !!isFeatured,
      createdAt: new Date().toISOString()
    };

    store.products.unshift(newProduct);

    return NextResponse.json({ message: 'Product created successfully', product: newProduct }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
