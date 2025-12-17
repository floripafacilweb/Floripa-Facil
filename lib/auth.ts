import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { PERMISSIONS } from "@/lib/permissions"

// Mock Data simulating DB Fetch with JOINs
const MOCK_ROLES = {
  ADMIN: {
    name: 'ADMIN',
    permissions: Object.values(PERMISSIONS) // All permissions
  },
  SALES: {
    name: 'SALES',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.PACKAGES_VIEW,
      PERMISSIONS.RESERVATIONS_VIEW,
      PERMISSIONS.RESERVATIONS_MANAGE,
      PERMISSIONS.PRICES_VIEW, // Can see prices, but not edit
    ]
  },
  VENDOR: {
    name: 'VENDOR',
    permissions: [
      PERMISSIONS.DASHBOARD_VIEW,
      PERMISSIONS.RESERVATIONS_VIEW, // Only assigned ones (logic in service)
      // Cannot see prices, packages, or manage users
    ]
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as any;
        
        // SIMULATED LOGIN WITH DB LOOKUP
        let roleKey = '';
        let userId = '';
        let userName = '';

        if (email === 'info.floripafacil@gmail.com' && password === 'Colo1981!') {
           // Mapea al rol ADMIN que tiene todos los permisos en esta simulación de auth
           roleKey = 'ADMIN'; userId = '1'; userName = 'Dueño Floripa';
        } else if (email === 'ventas@floripa.com' && password === 'ventas123') {
           roleKey = 'SALES'; userId = '2'; userName = 'Vendedor';
        } else if (email === 'proveedor@floripa.com' && password === 'prov123') {
           roleKey = 'VENDOR'; userId = '3'; userName = 'Transporte X';
        } else {
          return null;
        }

        const roleData = MOCK_ROLES[roleKey as keyof typeof MOCK_ROLES];

        return {
          id: userId,
          name: userName,
          email: email,
          role: roleKey,
          // CRITICAL: Pass permissions to the token
          permissions: roleData.permissions
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.permissions = (user as any).permissions
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string
        // Expose permissions to client session
        (session.user as any).permissions = token.permissions
      }
      return session
    },
  },
})