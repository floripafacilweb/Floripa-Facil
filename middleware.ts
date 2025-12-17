
import { auth } from "./lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin")

  // 1. Redirección simple para rutas protegidas
  if (isOnAdmin && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*"],
}
