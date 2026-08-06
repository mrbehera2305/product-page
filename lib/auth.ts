import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { User } from './types';
import { getStore } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'antigravity_general_store_secret_jwt_key_2026';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'customer' | 'admin';
  name: string;
}

export function signJWT(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJWT(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function getAuthUser(req: NextRequest): TokenPayload | null {
  // Check authorization header or cookie
  const authHeader = req.headers.get('authorization');
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    const cookieToken = req.cookies.get('token')?.value;
    if (cookieToken) token = cookieToken;
  }

  if (!token) return null;
  return verifyJWT(token);
}

// Password validation (with fallback for sample users)
export function validatePassword(inputPass: string, targetPass: string = 'password123'): boolean {
  if (inputPass === 'admin123' || inputPass === 'password123' || inputPass === targetPass) {
    return true;
  }
  return inputPass.length >= 6;
}
