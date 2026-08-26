import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/db';
import { signJWT, comparePassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, phone, identifier, password } = await req.json();

    // Support 'identifier' field (email or phone) or separate email/phone fields
    const loginId = (identifier || email || phone || '').trim();

    if (!loginId || !password) {
      return NextResponse.json({ error: 'Email/phone and password are required' }, { status: 400 });
    }

    const store = getStore();

    // Determine if the identifier is a phone number (all digits, 10 chars) or email
    const isPhone = /^\d{10}$/.test(loginId);

    const user = isPhone
      ? store.users.find(u => u.phone === loginId)
      : store.users.find(u => u.email?.toLowerCase() === loginId.toLowerCase());

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid email/phone or password' }, { status: 401 });
    }

    // Compare the provided password against the stored bcrypt hash
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email/phone or password' }, { status: 401 });
    }

    const token = signJWT({
      userId: user._id,
      email: user.email || '',
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      },
      token
    });

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


