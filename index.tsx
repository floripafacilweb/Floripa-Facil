
import React, { useState, useEffect, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  MapPin, Calendar, Users, CheckCircle, ArrowRight, Menu, X, Phone, Star, 
  ShieldCheck, Heart, CreditCard, ChevronLeft, Settings, Plus, Trash2, Edit2, 
  Save, LogOut, Image as ImageIcon, Lock, Eye, AlertTriangle, Shield, Key,
  BarChart3, Activity, DollarSign, Search, UserPlus, UserCheck, UserX,
  PieChart as PieIcon, TrendingUp, TrendingDown, Target, AlertCircle, 
  Briefcase, Sun, Umbrella, MessageCircle, MousePointer, Trophy, Split, ThumbsUp,
  Bus, Map, Camera, Anchor, Palmtree, Navigation, Clock, Layout, Monitor
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { getFinancialReport, FinancialReport } from './lib/finance';
import { trackABEvent } from './lib/analytics';
import { getPublicContent } from './lib/actions';

// --- PERMISSIONS ---
const PERMISSIONS = {
  OWNER_ACCESS: 'owner.access',
  FINANCE_VIEW: 'finance.dashboard.view',
  DASHBOARD_VIEW: 'dashboard.view',
  USERS_MANAGE: 'users.manage',
  ROLES_MANAGE: 'roles.manage',
  PACKAGES_VIEW: 'packages.view',
  PACKAGES_EDIT: 'packages.edit',
  PACKAGES_DELETE: 'packages.delete',
  STATS_GLOBAL_VIEW: 'stats.global.view',
  AUDIT_LOGS_VIEW: 'audit.logs.view',
};

// --- TYPES ---
interface AppUser {
  id: string;
  name: string;
  email: string;
  roleName: string; 
  isActive: boolean;
  permissions: string[]; 
}

const can = (user: AppUser | null, permission: string): boolean => {
  if (!user) return false;
  if (user.roleName === 'OWNER') return true; 
  if (user.roleName === 'ADMIN' && permission !== PERMISSIONS.OWNER_ACCESS) return true;
  return user.permissions.includes(permission);
};

// --- UI COMPONENTS ---
const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const base = "inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide";
  const variants: any = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md focus:ring-blue-500",
    secondary: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md focus:ring-emerald-500",
    outline: "border border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-600 bg-white",
    ghost: "text-slate-600 hover:bg-slate-50 hover:text-blue-600",
    shimmer: "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-[length:200%_100%] animate-[shimmer_3s_infinite] text-white shadow-lg"
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

const Card = ({ children, className = '', noPadding = false }: any) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden ${noPadding ? '' : 'p-6'} ${className}`}>{children}</div>
);

const ActivityCard = ({ title, subtitle, includes, details, price, tag }: any) => (
  <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="bg-slate-50 p-5 border-b border-slate-100">
      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full mb-3 inline-block bg-blue-100 text-blue-700">{tag}</span>
      <h3 className="text-xl font-extrabold text-slate-900 leading-tight">{title}</h3>
    </div>
    <div className="p-6 flex-1 flex flex-col">
      <p className="text-slate-600 text-sm font-medium mb-5 italic border-l-4 border-emerald-400 pl-3 leading-relaxed">{subtitle}</p>
      <ul className="space-y-2.5 mb-6 flex-1">
        {includes.map((item: string, i: number) => (
          <li key={i} className="flex items-start text-sm text-slate-700 font-medium">
            <CheckCircle size={14} className="text-emerald-500 mr-2 mt-0.5" /> {item}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-5 border-t border-slate-100">
        <div className="flex justify-between items-end mb-4">
          <span className="text-slate-400 text-xs font-bold uppercase">Desde</span>
          <span className="text-3xl font-black text-slate-900">{price}</span>
        </div>
        <Button className="w-full justify-center">Reservar Cupo <ArrowRight size={16} className="ml-2"/></Button>
      </div>
    </div>
  </div>
);

const HeroSlider = ({ images }: { images: string[] }) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % images.length), 5000);
    return () => clearInterval(interval);
  }, [images]);
  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((img, i) => (
        <div key={i} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundImage: `url('${img}')` }} />
      ))}
      <div className="absolute inset-0 bg-slate-900/50"></div>
    </div>
  );
};

// --- MAIN LANDING (CONSOLIDATED) ---
const MainLanding = ({ content }: { content: any }) => {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* HERO */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-900">
        <HeroSlider images={content.heroImages} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-900 font-bold text-xs mb-6">
               <Star size={12} fill="currentColor" /> 4.9/5 - Logística y Tours en Brasil
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              {content.hero.title.split(' ')[0]} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">
                {content.hero.title.split(' ').slice(1).join(' ')}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 mb-10 max-w-2xl leading-relaxed">{content.hero.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="shimmer" className="!text-lg !px-10 !py-4 shadow-xl hover:-translate-y-1 transform transition-all">
                <MessageCircle size={20} className="mr-2"/> {content.hero.primaryCTA}
              </Button>
              <Button variant="outline" className="!bg-white/10 !text-white !border-white/20 backdrop-blur-md !text-lg !px-10 !py-4">
                {content.hero.secondaryCTA}
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 mt-12 text-sm text-slate-300 font-medium">
              {content.hero.trustIndicators.map((item: string, i: number) => (
                <div key={i} className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400"/> {item}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVITIES */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Actividades Destacadas</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Los combos y traslados más solicitados para tu viaje.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.activities.map((act: any) => (
              <ActivityCard key={act.id} {...act} />
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Nuestros Destinos</h2>
            <p className="text-lg text-slate-500">Operamos en los puntos más importantes del sur de Brasil.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.destinations.map((dest: any, i: number) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-lg">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${dest.img}')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
                <div className="absolute bottom-0 p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">{dest.title}</h3>
                  <p className="text-slate-300 text-sm mb-4">{dest.desc}</p>
                  <div className="text-emerald-400 text-sm font-bold flex items-center">Ver más <ArrowRight size={16} className="ml-2"/></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-500 py-12 text-center text-sm">
        <p>© 2024 Floripa Fácil. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

// --- ADMIN DASHBOARD ---
const AdminDashboard = ({ user, onLogout, logoUrl, setLogoUrl }: any) => {
  const [activeTab, setActiveTab] = useState('analytics');
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <aside className="w-72 bg-slate-900 text-slate-300 fixed h-full flex flex-col z-20 shadow-xl">
        <div className="p-8">
          <div className="flex items-center gap-3 text-white mb-8">
            <Sun className="text-blue-500" size={24} />
            <span className="text-xl font-black">FLORIPA ADMIN</span>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">{user.name[0]}</div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] font-bold text-blue-400 uppercase">{user.roleName}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center p-3 rounded-lg transition-all ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
            <BarChart3 size={20} className="mr-3" /> Operativo
          </button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center p-3 rounded-lg transition-all ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>
            <Users size={20} className="mr-3" /> Usuarios
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center p-3 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors">
            <LogOut size={20} className="mr-3" /> Cerrar Sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-72 p-12">
         {activeTab === 'analytics' && <div className="text-2xl font-bold text-slate-900">Dashboard Operativo</div>}
         {activeTab === 'users' && <div className="text-2xl font-bold text-slate-900">Gestión de Usuarios</div>}
      </main>
    </div>
  );
};

const App = () => {
  const [view, setView] = useState('HOME');
  const [user, setUser] = useState<AppUser | null>(null);
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    getPublicContent().then(setContent);
  }, []);

  if (!content) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white animate-pulse">Cargando experiencia...</div>;

  if (view === 'ADMIN' && user) return <AdminDashboard user={user} onLogout={() => { setUser(null); setView('HOME'); }} />;
  if (view === 'ADMIN_LOGIN') return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm text-center">
        <Sun className="mx-auto text-blue-600 mb-4" size={48} />
        <h2 className="text-2xl font-black mb-6">Acceso Staff</h2>
        <Button className="w-full" onClick={() => { setUser({ id: '1', name: 'Dueño', email: 'info@floripafacil.com', roleName: 'OWNER', isActive: true, permissions: [] }); setView('ADMIN'); }}>Login Simulado</Button>
        <button className="mt-6 text-slate-400 text-sm" onClick={() => setView('HOME')}>Volver</button>
      </Card>
    </div>
  );

  return (
    <>
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('HOME')}>
            <div className="bg-blue-600 p-2 rounded-lg text-white"><Bus size={20}/></div>
            <span className="text-xl font-black tracking-tight">FLORIPA FÁCIL</span>
          </div>
          <Button variant="ghost" onClick={() => setView('ADMIN_LOGIN')}>Staff</Button>
        </div>
      </nav>
      <MainLanding content={content} />
    </>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
