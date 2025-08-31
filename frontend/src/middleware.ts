import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const protectedRoutes = ['/dashboard', '/chat', '/users', '/blogs', '/settings', '/profile'];
    const pathname: string = request.nextUrl.pathname;

    // Root route
    if (pathname === '/') {
        return NextResponse.redirect(
            new URL(token ? '/chat' : '/login', request.url)
        );
    }

    // Block login/register if already logged in
    if (token && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Protect certain routes
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/chat/:path*', '/profile/:path*', '/login/:path*', '/register/:path*', '/dashboard/:path*', '/users/:path*', '/blogs/:path*', '/settings/:path*'],
};

