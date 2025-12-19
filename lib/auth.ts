
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PERMISSIONS } from "@/lib/permissions"

const MOCK_ROLES = {
  ADMIN: {
    name: 'ADMIN',
    permissions: Object.values(PERMISSIONS)
  },
  SALES: {
    name: 'SALES',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.PACKAGES_VIEW,
      PERMISSIONS.RESERVATIONS_VIEW,
      PERMISSIONS.RESERVATIONS_MANAGE,
      PERMISSIONS.PRICES_VIEW,
    ]
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as any;

        if (email === 'info.floripafacil@gmail.com' && password === 'Colo1981!') {
           return {
             id: '1',
             name: 'Dueño Floripa',
             email: 'info.floripafacil@gmail.com',
             role: 'ADMIN',
             permissions: MOCK_ROLES.ADMIN.permissions
           }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.permissions = (user as any).permissions
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).role = token.role as string
        (session.user as any).permissions = token.permissions as string[]
      }
      return session
    },
  },
  secret: process.env.AUTH_SECRET || "any-random-string-for-dev",
})
