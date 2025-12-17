
'use server';

import { unstable_noStore as noStore } from "next/cache";
import { auth } from './auth';
import { can, PERMISSIONS } from './permissions';

/**
 * Función central de obtención de contenido público.
 * Utiliza noStore() para deshabilitar el cacheo estático de Vercel (Data Cache).
 */
export async function getPublicContent() {
  noStore();

  // Simulación de Base de Datos dinámica
  // Todo el contenido se centraliza aquí para facilitar actualizaciones sin redeplegar lógica
  return {
    hero: {
      title: "Disfrutá Brasil sin estrés",
      subtitle: "Coordinamos tu llegada y tus paseos. Vos solo preocupate por descansar.",
      primaryCTA: "Cotizar Traslado/Tour",
      secondaryCTA: "Ver Actividades",
      trustIndicators: [
        "Vehículos Habilitados",
        "Seguro de Pasajero",
        "Atención en Español"
      ]
    },
    activities: [
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
    ],
    destinations: [
      { title: 'Florianópolis', img: 'https://images.unsplash.com/photo-1626017088062-8e31a9863266?q=80&w=2070', desc: 'Traslados desde aeropuerto y paseos en la isla.' },
      { title: 'Bombinhas', img: 'https://images.unsplash.com/photo-1563116640-1a221f00882e?q=80&w=2070', desc: 'Tours de playas, buceo y traslados directos.' },
      { title: 'Camboriú', img: 'https://images.unsplash.com/photo-1555992984-25785a720db1?q=80&w=1974', desc: 'Parque Unipraias, traslados nocturnos y tours.' }
    ],
    heroImages: [
      "https://images.unsplash.com/photo-1596443686812-2f45229eeb33?q=80&w=2071",
      "https://images.unsplash.com/photo-1518182170546-0766ce6fbe56?q=80&w=2000",
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070",
      "https://images.unsplash.com/photo-1544237128-662b92158869?q=80&w=2070"
    ]
  };
}

export async function getDashboardStats() {
  const session = await auth();
  const user = session?.user as any;
  if (!user) return null;

  return {
    totalSales: 154000,
    totalCommissions: 23100,
    activeUsers: 12,
    recentActivity: [
      { action: 'SALE_CONFIRMED', user: 'Vendedor 1', time: '10 min ago' },
      { action: 'LOGIN', user: 'Admin', time: '1 hour ago' }
    ]
  };
}
