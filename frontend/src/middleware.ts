 // middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes to protect
const protectedRoutes = ["/dashboard", "/vehicles", "/profile"]

export function middleware(request: NextRequest) {
    console.log("✅ Middleware is running for:", request.nextUrl.pathname)
    const token = request.cookies.get("access_token")?.value

  const pathname = request.nextUrl.pathname
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtected && !token) {
     console.log("⛔ No token found. Redirecting to login.")
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/login"
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}
export const config = {
  matcher: [
    "/dashboard/:path", 
    "/dashboard",
    "/vehicles/:path", 
    "/vehicles",
    "/profile/:path*", 
    "/profile"
  ],
}