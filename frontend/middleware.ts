import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("AUTH_TOKEN")?.value;
  const role = request.cookies.get("USER_ROLE")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url) || request.cookies.get('token')?.value);
  }

  if (request.nextUrl.pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/client", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/client") && role === "admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/client/:path*"],
};
