
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin")
  const isOnVendor = req.nextUrl.pathname.startsWith("/proveedor")

  // 1. Redirect unauthenticated users
  if ((isOnAdmin || isOnVendor) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl))
  }

  // 2. Protect Admin Routes (Only ADMIN and SALES can enter, but SALES is restricted inside)
  if (isOnAdmin && role === 'VENDOR') {
    return NextResponse.redirect(new URL("/proveedor", req.nextUrl)) // Send vendors to their own area
  }

  // 3. Protect Vendor Routes
  if (isOnVendor && role !== 'VENDOR' && role !== 'ADMIN') {
    return NextResponse.redirect(new URL("/", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*", "/proveedor/:path*"],
}
