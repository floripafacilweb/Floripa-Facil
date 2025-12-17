
'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { can, PERMISSIONS } from '@/lib/permissions'
// import prisma from './prisma' 
// import bcrypt from 'bcryptjs'

// --- HELPER: ACTIVITY LOGGER ---
async function logActivity(userId: string, action: string, entity: string, details: string) {
  // await prisma.activityLog.create({
  //   data: { userId, action, entity, details }
  // })
  console.log(`[AUDIT] User ${userId} performed ${action} on ${entity}: ${details}`);
}

// --- AUTHORIZATION MIDDLEWARE FOR ACTIONS ---
async function authorize(permission: string) {
  const session = await auth()
  const user = session?.user as any
  
  if (!user || !can(user, permission)) {
    throw new Error(`Unauthorized: Missing permission ${permission}`)
  }
  return user
}

// --- USER MANAGEMENT ---

export async function createUser(formData: FormData) {
  const currentUser = await authorize(PERMISSIONS.USERS_MANAGE);
  
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;
  const password = formData.get('password') as string;

  // const hashedPassword = await bcrypt.hash(password, 10);

  // await prisma.user.create(...)
  
  await logActivity(currentUser.id, 'CREATE_USER', 'User', `Created user ${email} with role ${role}`);
  
  revalidatePath('/admin/users');
  return { success: true };
}

export async function updateUser(formData: FormData) {
  const currentUser = await authorize(PERMISSIONS.USERS_MANAGE);
  
  const id = formData.get('id') as string;
  const isActive = formData.get('isActive') === 'on';
  
  // await prisma.user.update(...)

  await logActivity(currentUser.id, 'UPDATE_USER', 'User', `Updated user ${id} status to ${isActive}`);
  revalidatePath('/admin/users');
  return { success: true };
}

export async function changePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");

  const newPassword = formData.get('newPassword') as string;
  // const hash = await bcrypt.hash(newPassword, 10);
  
  // await prisma.user.update({ where: { id: session.user.id }, data: { passwordHash: hash } })
  
  await logActivity(session.user.id as string, 'CHANGE_PASSWORD', 'User', 'User changed their own password');
  return { success: true };
}

// --- CONTENT MANAGEMENT ---

export async function savePackage(formData: FormData) {
  const currentUser = await authorize(PERMISSIONS.PACKAGES_EDIT);
  
  // ... (Existing logic)
  const title = formData.get('title') as string;
  
  await logActivity(currentUser.id, 'SAVE_PACKAGE', 'Package', `Saved package: ${title}`);

  revalidatePath('/admin');
  return { success: true };
}

export async function deleteItem(id: string, type: 'package' | 'destination') {
  const currentUser = await authorize(PERMISSIONS.PACKAGES_DELETE);
  
  await logActivity(currentUser.id, 'DELETE_ITEM', type, `Deleted ID: ${id}`);
  
  revalidatePath('/admin');
}

// --- ANALYTICS ---

export async function getDashboardStats() {
  const session = await auth();
  const user = session?.user as any;

  // Mock data simulation based on role
  if (can(user, PERMISSIONS.STATS_GLOBAL_VIEW)) {
    return {
      totalSales: 154000,
      totalCommissions: 23100,
      activeUsers: 12,
      recentActivity: [
        { action: 'SALE_CONFIRMED', user: 'Vendedor 1', time: '10 min ago' },
        { action: 'LOGIN', user: 'Admin', time: '1 hour ago' }
      ]
    };
  } else if (can(user, PERMISSIONS.STATS_PERSONAL_VIEW)) {
    return {
      totalSales: 12500, // Personal only
      totalCommissions: 1250,
      activeUsers: 0,
      recentActivity: []
    };
  }
  return null;
}
