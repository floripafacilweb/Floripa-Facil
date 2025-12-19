
import React from 'react';
import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Bus, LayoutDashboard, LogOut, Users, Package, ChevronRight } from 'lucide-react';

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const user = session.user as any;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden lg:flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <Bus className="text-blue-400" />
          <span className="font-black text-lg">FF ADMIN</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <div className="flex items-center gap-3 p-3 bg-blue-600 rounded-xl text-white font-bold">
            <LayoutDashboard size={20} /> Dashboard
          </div>
          <div className="flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-colors cursor-pointer">
            <Package size={20} /> Paquetes
          </div>
          <div className="flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-colors cursor-pointer">
            <Users size={20} /> Reservas
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <form action={async () => {
            'use server';
            await signOut();
          }}>
            <button className="flex items-center gap-3 p-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-bold">
              <LogOut size={20} /> Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-slate-200 p-6 flex justify-between items-center">
          <h1 className="text-2xl font-black text-slate-900">Bienvenido, {user.name}</h1>
          <div className="flex items-center gap-4">
            <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest border border-blue-200">
              {user.role}
            </span>
          </div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <p className="text-slate-500 text-sm font-bold uppercase mb-2">Ventas del Mes</p>
              <p className="text-4xl font-black text-slate-900">$12,450</p>
              <div className="mt-4 flex items-center text-emerald-500 text-sm font-bold">
                +12% vs mes pasado <ChevronRight size={14} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <p className="text-slate-500 text-sm font-bold uppercase mb-2">Reservas Activas</p>
              <p className="text-4xl font-black text-slate-900">42</p>
              <div className="mt-4 flex items-center text-blue-500 text-sm font-bold">
                8 pendientes de pago <ChevronRight size={14} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <p className="text-slate-500 text-sm font-bold uppercase mb-2">Tasa de Conversión</p>
              <p className="text-4xl font-black text-slate-900">3.8%</p>
              <div className="mt-4 flex items-center text-amber-500 text-sm font-bold">
                Optimizar checkout <ChevronRight size={14} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Tus Permisos Activos</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {user.permissions?.map((p: string) => (
                  <span key={p} className="bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-lg font-mono">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
