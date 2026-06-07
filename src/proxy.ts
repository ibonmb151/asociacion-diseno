import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Edge-compatible middleware - no Prisma imports allowed
export function proxy(request: NextRequest) {
  const { nextUrl } = request;

  // Check for any NextAuth session token cookie (handles all environments)
  const cookies = request.cookies;
  const sessionToken =
    cookies.get("next-auth.session-token")?.value ||
    cookies.get("__Secure-next-auth.session-token")?.value ||
    cookies.get("__Host-next-auth.session-token")?.value;

  const isLoggedIn = !!sessionToken;
  const isAuthPage = nextUrl.pathname.startsWith("/auth/");

  // Allow auth pages (login, register) without authentication
  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  // Protect all routes except public ones
  const publicPaths = ["/", "/api/auth", "/api/upload"];
  const isPublicPath = publicPaths.some(
    (path) =>
      nextUrl.pathname === path ||
      nextUrl.pathname.startsWith(path + "/")
  );

  if (!isLoggedIn && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
