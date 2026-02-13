import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// We use jose instead of jsonwebtoken because middleware runs in Edge Runtime
// where Node.js crypto modules aren't available. jose is Edge-compatible.
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-it-in-prod'
);

async function verifyAuth(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { uid: string; email: string; role: string; displayName: string };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('auth_token')?.value;

  // ── Admin routes protection ──────────────────────────────────────
  // Block all /admin/* routes for unauthenticated users or non-admin roles
  if (path.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    const session = await verifyAuth(token);

    if (!session) {
      // Invalid/expired token - clear cookie and redirect to login
      const response = NextResponse.redirect(new URL('/sign-in', request.url));
      response.cookies.delete('auth_token');
      return response;
    }

    if (session.role !== 'admin') {
      // Authenticated but not admin - redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // ── Sign-in page: redirect if already logged in ──────────────────
  if (path === '/sign-in') {
    if (token) {
      const session = await verifyAuth(token);
      if (session) {
        // Already logged in, redirect based on role
        if (session.role === 'admin') {
          return NextResponse.redirect(new URL('/admin/destinos', request.url));
        }
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/sign-in',
  ],
};
