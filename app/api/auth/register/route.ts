import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/db';
import { signJWT, hashPassword } from '@/lib/auth';
import { User } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone, address } = await req.json();

    if (!name || !password) {
      return NextResponse.json({ error: 'Name and password are required' }, { status: 400 });
    }

    const trimmedEmail = email?.trim().toLowerCase() || '';
    const trimmedPhone = phone?.trim() || '';

    if (!trimmedEmail && !trimmedPhone) {
      return NextResponse.json({ error: 'Either email or phone number is required' }, { status: 400 });
    }

    // Validate email format if provided
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    // Validate phone format if provided (10 digits)
    if (trimmedPhone && !/^\d{10}$/.test(trimmedPhone)) {
      return NextResponse.json({ error: 'Please enter a valid 10-digit phone number' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const store = getStore();

    // Check for duplicate email
    if (trimmedEmail) {
      const existingEmail = store.users.find(u => u.email?.toLowerCase() === trimmedEmail);
      if (existingEmail) {
        return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
      }
    }

    // Check for duplicate phone
    if (trimmedPhone) {
      const existingPhone = store.users.find(u => u.phone === trimmedPhone);
      if (existingPhone) {
        return NextResponse.json({ error: 'User with this phone number already exists' }, { status: 400 });
      }
    }

    // Hash the password before storing
    const hashedPassword = await hashPassword(password);

    const newUser: User = {
      _id: `usr_${Date.now()}`,
      name,
      email: trimmedEmail,
      password: hashedPassword,
      role: 'customer',
      phone: trimmedPhone,
      address: address?.trim() || '',
      createdAt: new Date().toISOString()
    };

    store.users.push(newUser);

    const token = signJWT({
      userId: newUser._id,
      email: newUser.email || '',
      role: newUser.role,
      name: newUser.name,
    });

    // Exclude password from response
    const { password: _, ...safeUser } = newUser;

    const response = NextResponse.json({
      message: 'Account created successfully',
      user: safeUser,
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


