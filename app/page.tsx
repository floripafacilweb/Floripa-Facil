
import React from 'react';
import { getPublicContent } from '@/lib/actions';
import { LandingUI } from './LandingUI';

// Forzamos renderizado dinámico total para evitar el error de caché en Vercel
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function HomePage() {
  // Fetch de datos en el servidor (Server Component)
  const content = await getPublicContent();

  return <LandingUI content={content} />;
}
