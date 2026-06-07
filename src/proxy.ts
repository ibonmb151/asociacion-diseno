import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { nextUrl } = request;

  const cookies = request.cookies;
  const sessionToken =
    cookies.get("next-auth.session-token")?.value ||
    cookies.get("__Secure-next-auth.session-token")?.value ||
    cookies.get("__Host-next-auth.session-token")?.value;

  const response = NextResponse.next();

  response.headers.set("x-debug-cookie", sessionToken ? "found" : "missing");
  response.headers.set(
    "x-debug-cookie-names",
    cookies
      .getAll()
      .map((c) => c.name)
      .join(","),
  );

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
