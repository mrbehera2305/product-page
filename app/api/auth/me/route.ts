import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { getStore } from '@/lib/db';

export async function GET(req: NextRequest) {
  const payload = getAuthUser(req);
  if (!payload) {
    return NextResponse.json({ user: null });
  }

  const store = getStore();
  const user = store.users.find(u => u._id === payload.userId);
  if (!user) {
    return NextResponse.json({ user: null });
  }

  const { password, ...safeUser } = user;
  return NextResponse.json({ user: safeUser });
}
