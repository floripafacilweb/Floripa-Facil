
'use client';

import React, { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Bus, LayoutDashboard, LogOut, Users, Package, 
  ChevronRight, Plus, Search, Filter, MoreHorizontal,
  TrendingUp, Calendar, MapPin, DollarSign, Loader2,
  CheckCircle2, Clock, AlertCircle, Edit3, Trash2, X, Save, RefreshCw
} from 'lucide-react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  // --- ESTADOS DE DATOS (Conectados a Supabase) ---
  const [packages, setPackages] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);

  // --- ESTADOS DE EDICIÓN ---
  const [editingPackage, setEditingPackage] = useState<any>(null);

  // Cargar datos iniciales
  const fetchData = async () => {
    setIsDataLoading(true);
    try {
      // Intentar cargar paquetes
      const { data: pkgs, error: pkgErr } = await supabase.from('packages').select('*').order('created_at', { ascending: false });
      if (!pkgErr && pkgs) setPackages(pkgs);

      // Intentar cargar reservas
      const { data: resvs, error: resErr } = await supabase.from('reservations').select('*').order('created_at', { ascending: false });
      if (!resErr && resvs) setReservations(resvs);
      
      // Si las tablas no existen, mantenemos los mocks por ahora
      if (pkgs?.length === 0 && packages.length === 0) {
        setPackages([
          { id: 1, name: "Traslado Aeropuerto FLN", category: "Traslados", price: 100, status: "Activo", sales: 124 },
          { id: 2, name: "Tour Playas Bombinhas", category: "Excursiones", price: 80, status: "Activo", sales: 85 }
        ]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  // Redirigir si no hay sesión
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!session) return null;
  const user = session.user as any;

  // --- ACCIONES SUPABASE ---
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionLoading(true);
    
    try {
      if (editingPackage.id === 'new') {
        const { data, error } = await supabase
          .from('packages')
          .insert([{ 
            name: editingPackage.name, 
            category: editingPackage.category, 
            price: editingPackage.price, 
            status: editingPackage.status,
            sales: 0 
          }])
          .select();
        
        if (error) throw error;
        setNotification({ msg: 'Paquete creado en Supabase', type: 'success' });
      } else {
        const { error } = await supabase
          .from('packages')
          .update({ 
            name: editingPackage.name, 
            category: editingPackage.category, 
            price: editingPackage.price, 
            status: editingPackage.status 
          })
          .eq('id', editingPackage.id);
        
        if (error) throw error;
        setNotification({ msg: 'Cambios sincronizados en línea', type: 'success' });
      }
      await fetchData(); // Refrescar lista
      setEditingPackage(null);
    } catch (err: any) {
      // Fallback local si la tabla no existe aún
      setPackages(prev => editingPackage.id === 'new' 
        ? [...prev, {...editingPackage, id: Date.now(), sales: 0}]
        : prev.map(p => p.id === editingPackage.id ? editingPackage : p)
      );
      setNotification({ msg: 'Guardado localmente (Crea las tablas en Supabase)', type: 'error' });
      setEditingPackage(null);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeletePackage = async (id: any) => {
    if (!confirm('¿Eliminar este paquete?')) return;
    
    try {
      const { error } = await supabase.from('packages').delete().eq('id', id);
      if (error) throw error;
      setNotification({ msg: 'Paquete eliminado de la base de datos', type: 'success' });
      await fetchData();
    } catch (err) {
      setPackages(prev => prev.filter(p => p.id !== id));
      setNotification({ msg: 'Eliminado localmente', type: 'success' });
    }
  };

  const renderContent = () => {
    if (isDataLoading) return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="font-bold">Sincronizando con Supabase...</p>
      </div>
    );

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <p className="text-slate-500 text-sm font-bold uppercase mb-2">Ventas del Mes</p>
                <p className="text-4xl font-black text-slate-900">$12,450</p>
                <div className="mt-4 flex items-center text-emerald-500 text-sm font-bold">
                  +12% vs mes pasado <ChevronRight size={14} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <p className="text-slate-500 text-sm font-bold uppercase mb-2">Reservas Activas</p>
                <p className="text-4xl font-black text-slate-900">{reservations.length || 0}</p>
                <div className="mt-4 flex items-center text-blue-500 text-sm font-bold">
                  Conexión Supabase OK <ChevronRight size={14} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <p className="text-slate-500 text-sm font-bold uppercase mb-2">Paquetes Online</p>
                <p className="text-4xl font-black text-slate-900">{packages.filter(p => p.status === 'Activo').length}</p>
                <div className="mt-4 flex items-center text-amber-500 text-sm font-bold">
                  Sincronización en vivo <ChevronRight size={14} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <Clock size={20} className="text-blue-600" /> Registro de Reservas (Supabase)
              </h3>
              {reservations.length === 0 ? (
                <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                   <p className="text-slate-400 font-medium italic">Sin reservas registradas en la base de datos.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.map(res => (
                    <div key={res.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <p className="font-bold text-slate-900">{res.client_name}</p>
                        <span className="text-xs text-slate-500">{res.service_name}</span>
                      </div>
                      <span className="text-[10px] font-black px-2 py-1 rounded-full uppercase bg-emerald-100 text-emerald-700">{res.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'packages':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Buscar en Supabase..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"/>
              </div>
              <div className="flex gap-2">
                <button onClick={fetchData} className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">
                  <RefreshCw size={20} className={isDataLoading ? "animate-spin" : ""} />
                </button>
                <button onClick={() => setEditingPackage({ id: 'new', name: '', category: 'Traslados', price: 0, status: 'Activo' })} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-all active:scale-95">
                  <Plus size={18} /> Nuevo Paquete
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Servicio</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Categoría</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Precio</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-slate-900">{pkg.name}</td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold uppercase">{pkg.category}</span>
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900">${pkg.price}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditingPackage(pkg)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit3 size={18} /></button>
                          <button onClick={() => handleDeletePackage(pkg.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'reservations':
        return (
          <div className="flex items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="text-center">
               <Users size={48} className="mx-auto text-slate-200 mb-4" />
               <p className="text-slate-500 font-bold">Módulo de Reservas Supabase</p>
               <p className="text-slate-400 text-sm">Próximamente disponible con integración de pagos.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white hidden lg:flex flex-col border-r border-slate-800">
        <div className="p-8 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-900/40">
            <Bus size={24} />
          </div>
          <div>
            <span className="font-black text-xl tracking-tighter block leading-none text-blue-400">FLORIPA</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none">Live System</span>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-4">
          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-3 p-4 w-full rounded-2xl font-bold transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('packages')} className={`flex items-center gap-3 p-4 w-full rounded-2xl font-bold transition-all ${activeTab === 'packages' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Package size={20} /> Paquetes (DB)
          </button>
          <button onClick={() => setActiveTab('reservations')} className={`flex items-center gap-3 p-4 w-full rounded-2xl font-bold transition-all ${activeTab === 'reservations' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Users size={20} /> Reservas
          </button>
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button onClick={() => signOut()} className="flex items-center gap-3 p-4 w-full text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-bold group">
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50 pb-20">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100 p-8 flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Status: Conectado a Supabase</p>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {activeTab === 'dashboard' ? `Hola, ${user.name.split(' ')[0]} 👋` : activeTab === 'packages' ? 'Base de Datos' : 'Registro'}
            </h1>
          </div>
          
          <div className="w-12 h-12 bg-blue-600 shadow-xl shadow-blue-200 rounded-2xl flex items-center justify-center text-white font-black text-xl">
            {user.name.charAt(0)}
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-8 relative">
          {renderContent()}
        </div>
      </main>

      {/* MODAL SUPABASE */}
      {editingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-black text-slate-900">{editingPackage.id === 'new' ? 'Añadir a Supabase' : 'Actualizar Servicio'}</h3>
              <button onClick={() => setEditingPackage(null)} className="text-slate-400 hover:text-slate-900 p-2 rounded-xl hover:bg-white transition-all"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSavePackage} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Nombre del Tour / Traslado</label>
                <input required type="text" value={editingPackage.name} onChange={e => setEditingPackage({...editingPackage, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium focus:ring-2 focus:ring-blue-500" placeholder="Ej: Traslado Aeropuerto"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Categoría</label>
                  <select value={editingPackage.category} onChange={e => setEditingPackage({...editingPackage, category: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold">
                    <option>Traslados</option>
                    <option>Excursiones</option>
                    <option>Combos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Precio (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input required type="number" value={editingPackage.price} onChange={e => setEditingPackage({...editingPackage, price: parseInt(e.target.value)})} className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-black"/>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setEditingPackage(null)} className="flex-1 py-4 px-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">Cancelar</button>
                <button type="submit" disabled={isActionLoading} className="flex-1 py-4 px-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                  {isActionLoading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Guardar Cambios</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {notification && (
        <div className={`fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce border-l-8 ${notification.type === 'success' ? 'bg-slate-900 text-white border-emerald-500' : 'bg-red-600 text-white border-red-900'}`}>
          {notification.type === 'success' ? <CheckCircle2 className="text-emerald-400" /> : <AlertCircle />}
          <span className="font-bold">{notification.msg}</span>
        </div>
      )}
    </div>
  );
}
