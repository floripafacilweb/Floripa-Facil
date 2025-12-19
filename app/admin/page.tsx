
'use client';

import React, { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Bus, LayoutDashboard, LogOut, Users, Package, 
  ChevronRight, Plus, Search, Filter, MoreHorizontal,
  TrendingUp, Calendar, MapPin, DollarSign, Loader2,
  CheckCircle2, Clock, AlertCircle, Edit3, Trash2, X, Save
} from 'lucide-react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  // --- ESTADOS DE DATOS (Simulando DB) ---
  const [packages, setPackages] = useState([
    { id: 1, name: "Traslado Aeropuerto FLN", category: "Traslados", price: 100, status: "Activo", sales: 124 },
    { id: 2, name: "Tour Playas Bombinhas", category: "Excursiones", price: 80, status: "Activo", sales: 85 },
    { id: 3, name: "Combo Relax Premium", category: "Combos", price: 220, status: "Pausado", sales: 42 },
  ]);

  const [reservations, setReservations] = useState([
    { id: "RES-9821", client: "Juan Pérez", date: "24 Oct 2024", status: "Confirmada", total: 100, service: "Traslado Privado" },
    { id: "RES-9822", client: "María García", date: "25 Oct 2024", status: "Pendiente", total: 220, service: "Combo Bombinhas" },
    { id: "RES-9823", client: "Carlos López", date: "26 Oct 2024", status: "Cancelada", total: 80, service: "Tour Bombinhas" },
  ]);

  // --- ESTADOS DE EDICIÓN ---
  const [editingPackage, setEditingPackage] = useState<any>(null);

  // Redirigir si no hay sesión
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Auto-cerrar notificaciones
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

  // --- ACCIONES ---
  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionLoading(true);
    
    // Simular latencia de red (lo que haría Supabase)
    setTimeout(() => {
      if (editingPackage.id === 'new') {
        const newPkg = { ...editingPackage, id: Date.now(), sales: 0 };
        setPackages([...packages, newPkg]);
        setNotification({ msg: 'Paquete creado correctamente', type: 'success' });
      } else {
        setPackages(packages.map(p => p.id === editingPackage.id ? editingPackage : p));
        setNotification({ msg: 'Paquete actualizado con éxito', type: 'success' });
      }
      setEditingPackage(null);
      setIsActionLoading(false);
    }, 800);
  };

  const handleDeletePackage = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este paquete? Esta acción no se puede deshacer.')) {
      setPackages(packages.filter(p => p.id !== id));
      setNotification({ msg: 'Paquete eliminado', type: 'success' });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-blue-600">
                  <TrendingUp size={80} />
                </div>
                <p className="text-slate-500 text-sm font-bold uppercase mb-2">Ventas del Mes</p>
                <p className="text-4xl font-black text-slate-900">$12,450</p>
                <div className="mt-4 flex items-center text-emerald-500 text-sm font-bold">
                  +12% vs mes pasado <ChevronRight size={14} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <p className="text-slate-500 text-sm font-bold uppercase mb-2">Reservas Activas</p>
                <p className="text-4xl font-black text-slate-900">{reservations.length}</p>
                <div className="mt-4 flex items-center text-blue-500 text-sm font-bold">
                  {reservations.filter(r => r.status === 'Pendiente').length} pendientes de pago <ChevronRight size={14} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <p className="text-slate-500 text-sm font-bold uppercase mb-2">Paquetes Disponibles</p>
                <p className="text-4xl font-black text-slate-900">{packages.filter(p => p.status === 'Activo').length}</p>
                <div className="mt-4 flex items-center text-amber-500 text-sm font-bold">
                  {packages.filter(p => p.status === 'Pausado').length} en pausa <ChevronRight size={14} />
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                  <Clock size={20} className="text-blue-600" /> Actividad Reciente
                </h3>
                <div className="space-y-6">
                  {reservations.slice(0, 3).map((res) => (
                    <div key={res.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
                          <Users size={18} className="text-slate-600" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{res.client}</p>
                          <p className="text-xs text-slate-500">{res.service} • {res.date}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                        res.status === 'Confirmada' ? 'bg-emerald-100 text-emerald-700' : 
                        res.status === 'Pendiente' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {res.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                  <AlertCircle size={20} className="text-amber-500" /> Notificaciones del Sistema
                </h3>
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-amber-400 bg-amber-50 rounded-r-xl">
                    <p className="text-sm font-bold text-amber-900">Actualización de Precios</p>
                    <p className="text-xs text-amber-700 mt-1">Los traslados a Bombinhas aumentarán un 5% a partir de Noviembre.</p>
                  </div>
                  <div className="p-4 border-l-4 border-blue-400 bg-blue-50 rounded-r-xl">
                    <p className="text-sm font-bold text-blue-900">Sincronización Supabase</p>
                    <p className="text-xs text-blue-700 mt-1">Estructura de tablas lista para conectar con el backend real.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'packages':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar por nombre o categoría..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <button 
                onClick={() => setEditingPackage({ id: 'new', name: '', category: 'Traslados', price: 0, status: 'Activo' })}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                <Plus size={18} /> Nuevo Paquete
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Servicio</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Categoría</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Precio</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Ventas</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Estado</th>
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
                      <td className="px-6 py-4 text-slate-600 font-medium">{pkg.sales} unid.</td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 text-xs font-bold ${pkg.status === 'Activo' ? 'text-emerald-600' : 'text-slate-400'}`}>
                          <div className={`w-2 h-2 rounded-full ${pkg.status === 'Activo' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                          {pkg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setEditingPackage(pkg)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Editar"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeletePackage(pkg.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
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
          <div className="space-y-6 animate-fade-in">
             <div className="flex gap-4">
              <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2 text-sm font-bold text-slate-600 cursor-pointer hover:bg-slate-50">
                <Filter size={16} /> Todos los estados
              </div>
              <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2 text-sm font-bold text-slate-600 cursor-pointer hover:bg-slate-50">
                <Calendar size={16} /> Este mes
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {reservations.map((res) => (
                <div key={res.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl ${
                      res.status === 'Confirmada' ? 'bg-emerald-50 text-emerald-600' : 
                      res.status === 'Pendiente' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                    }`}>
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-400 tracking-tighter">{res.id}</span>
                        <h4 className="font-black text-slate-900 text-lg leading-none">{res.client}</h4>
                      </div>
                      <p className="text-slate-500 text-sm mt-1">{res.service} • {res.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-400 uppercase">Total Cobrado</p>
                      <p className="text-xl font-black text-slate-900">${res.total}</p>
                    </div>
                    <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-600 transition-colors">
                      Ver Detalles
                    </button>
                  </div>
                </div>
              ))}
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
            <span className="font-black text-xl tracking-tighter block leading-none">FLORIPA</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none">Control Panel</span>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-4">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 p-4 w-full rounded-2xl font-bold transition-all ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          
          <button 
            onClick={() => setActiveTab('packages')}
            className={`flex items-center gap-3 p-4 w-full rounded-2xl font-bold transition-all ${
              activeTab === 'packages' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Package size={20} /> Paquetes
          </button>
          
          <button 
            onClick={() => setActiveTab('reservations')}
            className={`flex items-center gap-3 p-4 w-full rounded-2xl font-bold transition-all ${
              activeTab === 'reservations' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users size={20} /> Reservas
          </button>
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-3 p-4 w-full text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-bold group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50 pb-20">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100 p-8 flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Empresa: Floripa Fácil</p>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {activeTab === 'dashboard' ? `Hola, ${user.name.split(' ')[0]} 👋` : 
               activeTab === 'packages' ? 'Gestión de Paquetes' : 'Registro de Reservas'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-black text-slate-900 leading-none">{user.name}</span>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Acceso Nivel {user.role}</span>
            </div>
            <div className="w-12 h-12 bg-blue-100 border-2 border-white shadow-sm rounded-2xl flex items-center justify-center text-blue-600 font-black">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-8 relative">
          {renderContent()}
        </div>
      </main>

      {/* --- MODAL DE EDICIÓN / CREACIÓN --- */}
      {editingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-black text-slate-900">
                {editingPackage.id === 'new' ? 'Crear Nuevo Paquete' : 'Editar Paquete'}
              </h3>
              <button onClick={() => setEditingPackage(null)} className="text-slate-400 hover:text-slate-900 p-2 rounded-xl hover:bg-white transition-all">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSavePackage} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Nombre del Servicio</label>
                <input 
                  required
                  type="text" 
                  value={editingPackage.name}
                  onChange={e => setEditingPackage({...editingPackage, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  placeholder="Ej: Traslado a Camboriú"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Categoría</label>
                  <select 
                    value={editingPackage.category}
                    onChange={e => setEditingPackage({...editingPackage, category: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  >
                    <option>Traslados</option>
                    <option>Excursiones</option>
                    <option>Combos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Precio (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      required
                      type="number" 
                      value={editingPackage.price}
                      onChange={e => setEditingPackage({...editingPackage, price: parseInt(e.target.value)})}
                      className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-black"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Estado</label>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setEditingPackage({...editingPackage, status: 'Activo'})}
                    className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${editingPackage.status === 'Activo' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                  >
                    Activo
                  </button>
                  <button 
                    type="button"
                    onClick={() => setEditingPackage({...editingPackage, status: 'Pausado'})}
                    className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${editingPackage.status === 'Pausado' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                  >
                    Pausado
                  </button>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setEditingPackage(null)}
                  className="flex-1 py-4 px-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isActionLoading}
                  className="flex-1 py-4 px-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isActionLoading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Guardar</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- NOTIFICACIONES TOAST --- */}
      {notification && (
        <div className={`fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce border-l-8 ${
          notification.type === 'success' ? 'bg-slate-900 text-white border-emerald-500' : 'bg-red-600 text-white border-red-900'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="text-emerald-400" /> : <AlertCircle />}
          <span className="font-bold">{notification.msg}</span>
        </div>
      )}
    </div>
  );
}
