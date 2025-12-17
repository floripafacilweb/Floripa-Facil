
import { auth } from './auth'
import { can, PERMISSIONS } from './permissions'

// Mock server-side function for client-side demo
const revalidatePath = (path: string) => {
  console.log(`[Mock] Revalidating path: ${path}`);
}

// --- HELPER: ACTIVITY LOGGER ---
async function logActivity(userId: string, action: string, entity: string, details: string) {
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

// --- PUBLIC CONTENT MANAGEMENT (DYNAMIC FETCHING) ---

export async function getPublicContent() {
  // MOCK DATABASE FOR PUBLIC CONTENT
  const activities = [
    {
      id: 'act-1',
      tag: "Traslado Privado",
      title: "Traslado Aeropuerto ✈️ → Alojamiento",
      subtitle: "Llegá tranquilo a tu alojamiento con chofer local y atención en español.",
      includes: ["Vehículo cómodo y habilitado", "Chofer local", "Puntualidad garantizada", "Atención en español"],
      details: ["Desde el aeropuerto de Florianópolis", "Hacia Floripa / Bombinhas / Camboriú", "Servicio privado exclusivo"],
      price: "USD 100"
    },
    {
      id: 'act-2',
      tag: "Excursión Estrella",
      title: "Excursión Playas de Bombinhas",
      subtitle: "Playas tranquilas, agua cristalina y cero preocupaciones.",
      includes: ["Traslado ida y vuelta", "Visita a playas seleccionadas", "Tiempo libre para disfrutar", "Asistencia en español"],
      details: ["Duración aprox: medio día", "Salida desde Florianópolis / Bombinhas", "Apta para parejas y familias"],
      price: "USD 80"
    },
    {
      id: 'act-3',
      tag: "Combo Ahorro",
      title: "Bombinhas Relax – Traslados + Excursión",
      subtitle: "Todo organizado para que solo disfrutes del viaje.",
      includes: ["Traslado Florianópolis ↔ Bombinhas", "Excursión playas de Bombinhas", "Asistencia en español"],
      details: ["No incluye alojamiento", "Ideal si ya tenés dónde hospedarte", "Coordinación total de logística"],
      price: "USD 220"
    }
  ];

  const heroImages = [
    "https://images.unsplash.com/photo-1596443686812-2f45229eeb33?q=80&w=2071",
    "https://images.unsplash.com/photo-1518182170546-0766ce6fbe56?q=80&w=2000",
    "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070",
    "https://images.unsplash.com/photo-1544237128-662b92158869?q=80&w=2070"
  ];

  revalidatePath('/');

  return {
    activities,
    heroImages,
  };
}


// --- USER MANAGEMENT ---

export async function createUser(formData: FormData) {
  const currentUser = await authorize(PERMISSIONS.USERS_MANAGE);
  
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;
  
  await logActivity(currentUser.id, 'CREATE_USER', 'User', `Created user ${email} with role ${role}`);
  
  revalidatePath('/admin/users');
  return { success: true };
}

export async function updateUser(formData: FormData) {
  const currentUser = await authorize(PERMISSIONS.USERS_MANAGE);
  
  const id = formData.get('id') as string;
  const isActive = formData.get('isActive') === 'on';
  
  await logActivity(currentUser.id, 'UPDATE_USER', 'User', `Updated user ${id} status to ${isActive}`);
  revalidatePath('/admin/users');
  return { success: true };
}

export async function changePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");

  await logActivity(session.user.id as string, 'CHANGE_PASSWORD', 'User', 'User changed their own password');
  return { success: true };
}

// --- CONTENT MANAGEMENT ---

export async function savePackage(formData: FormData) {
  const currentUser = await authorize(PERMISSIONS.PACKAGES_EDIT);
  
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
