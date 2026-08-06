import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  const store = getStore();
  return NextResponse.json({ settings: store.settings });
}

export async function PUT(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
  }

  const body = await req.json();
  const store = getStore();

  store.settings = {
    ...store.settings,
    ...body
  };

  return NextResponse.json({ message: 'Store settings updated successfully', settings: store.settings });
}
