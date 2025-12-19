
import { auth } from "./lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req

  const isOnAdmin = nextUrl.pathname.startsWith("/admin")
  const isOnLogin = nextUrl.pathname.startsWith("/login")

  // Si intenta ir a admin sin estar logueado
  if (isOnAdmin && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  // Si ya está logueado e intenta ir al login, mandarlo al admin
  if (isOnLogin && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
