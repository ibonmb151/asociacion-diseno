import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { nextUrl } = request;

  const sessionToken =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value ||
    request.cookies.get("__Host-next-auth.session-token")?.value;

  const isLoggedIn = !!sessionToken;
  const isAuthPage = nextUrl.pathname.startsWith("/auth/");

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  const publicPaths = ["/", "/api/auth", "/api/upload"];
  const isPublicPath = publicPaths.some(
    (path) =>
      nextUrl.pathname === path ||
      nextUrl.pathname.startsWith(path + "/"),
  );

  if (!isLoggedIn && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
