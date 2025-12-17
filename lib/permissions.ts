
// --- PERMISSION KEYS CONSTANTS ---
export const PERMISSIONS = {
  // System Owner
  OWNER_ACCESS: 'owner.access', // Super permission
  
  // Finance (CEO Level)
  FINANCE_VIEW: 'finance.dashboard.view',
  
  // Dashboard & Access
  DASHBOARD_VIEW: 'dashboard.view',
  
  // Users & Roles
  USERS_MANAGE: 'users.manage',
  USERS_VIEW: 'users.view',
  ROLES_MANAGE: 'roles.manage',
  
  // Packages
  PACKAGES_VIEW: 'packages.view',
  PACKAGES_CREATE: 'packages.create',
  PACKAGES_EDIT: 'packages.edit',
  PACKAGES_DELETE: 'packages.delete',
  
  // Financials & Analytics
  PRICES_VIEW: 'prices.view',
  PRICES_EDIT: 'prices.edit',
  STATS_GLOBAL_VIEW: 'stats.global.view', // See all sales
  STATS_PERSONAL_VIEW: 'stats.personal.view', // See own sales
  AUDIT_LOGS_VIEW: 'audit.logs.view',
  
  // Destinations
  DESTINATIONS_MANAGE: 'destinations.manage',
  
  // Reservations
  RESERVATIONS_VIEW: 'reservations.view',
  RESERVATIONS_MANAGE: 'reservations.manage',
} as const;

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export interface UserWithPermissions {
  id: string;
  role: string;
  permissions: string[];
}

/**
 * Universal Authorization Helper
 * Works in Server Actions, Components, and Middleware context
 */
export function can(user: UserWithPermissions | null | undefined, permission: string): boolean {
  if (!user) return false;
  
  // Root Owner Override
  if (user.role === 'OWNER') return true;
  if (user.role === 'ADMIN' && permission !== PERMISSIONS.OWNER_ACCESS) return true;

  return user.permissions.includes(permission);
}
