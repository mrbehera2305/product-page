import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/db';
import { signJWT } from '@/lib/auth';
import { User } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone, address } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    const store = getStore();
    const existing = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const newUser: User = {
      _id: `usr_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      role: 'customer',
      phone: phone || '',
      address: address || '',
      createdAt: new Date().toISOString()
    };

    store.users.push(newUser);

    const token = signJWT({
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    const response = NextResponse.json({
      message: 'Account created successfully',
      user: newUser,
      token
    }, { status: 201 });

    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
