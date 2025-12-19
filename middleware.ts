
import { auth } from "./lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin")

  if (isOnAdmin && !isLoggedIn) {
    // Si no está logueado y trata de entrar a /admin, mandamos al login público o de admin
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  // El matcher asegura que el middleware solo corra en rutas específicas y no en estáticos
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
