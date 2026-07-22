import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token");

  const protectedRoutes = [
    "/dashboard",
    "/contacts",
    "/templates",
    "/campaigns",
    "/analytics",
    "/settings"
  ];

  const isProtected = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Prevent logged-in users from seeing login/signup pages
  const authRoutes = ["/login", "/signup"];
  const isAuthRoute = authRoutes.some(route => request.nextUrl.pathname.startsWith(route));
  
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/contacts/:path*",
    "/templates/:path*",
    "/campaigns/:path*",
    "/analytics/:path*",
    "/settings/:path*",
    "/login",
    "/signup"
  ],
};