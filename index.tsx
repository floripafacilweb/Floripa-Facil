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
// IMPORTANTE: Se asume que recharts está instalado. 
// En un entorno real: npm install recharts
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { getFinancialReport, FinancialReport } from './lib/finance';
import { getABTestResults, trackABEvent, ABTestResult, ABMetrics } from './lib/analytics';
import { getPublicContent } from './lib/actions';

// --- PERMISSIONS CONSTANTS (NO CHANGE) ---
const PERMISSIONS = {
  OWNER_ACCESS: 'owner.access',
  FINANCE_VIEW: 'finance.dashboard.view',
  DASHBOARD_VIEW: 'dashboard.view',
  USERS_MANAGE: 'users.manage',
  ROLES_MANAGE: 'roles.manage',
  PACKAGES_VIEW: 'packages.view',
  PACKAGES_CREATE: 'packages.create',
  PACKAGES_EDIT: 'packages.edit',
  PACKAGES_DELETE: 'packages.delete',
  PRICES_VIEW: 'prices.view',
  PRICES_EDIT: 'prices.edit',
  DESTINATIONS_MANAGE: 'destinations.manage',
  RESERVATIONS_VIEW: 'reservations.view',
  RESERVATIONS_MANAGE: 'reservations.manage',
  STATS_GLOBAL_VIEW: 'stats.global.view',
  STATS_PERSONAL_VIEW: 'stats.personal.view',
  AUDIT_LOGS_VIEW: 'audit.logs.view',
  AB_TEST_VIEW: 'ab.test.view',
};

const AVAILABLE_PERMISSIONS = Object.values(PERMISSIONS);

// --- TYPES (NO CHANGE) ---
interface AppRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface AppUser {
  id: string;
  name: string;
  email: string;
  roleName: string; 
  isActive: boolean;
  permissions: string[]; 
}

interface Sale {
  id: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  commission: number;
  date: string;
}

interface Log {
  id: string;
  user: string;
  action: string;
  target: string;
  date: string;
}

// --- HELPER (NO CHANGE) ---
const can = (user: AppUser | null, permission: string): boolean => {
  if (!user) return false;
  if (user.roleName === 'OWNER') return true; 
  if (user.roleName === 'ADMIN' && permission !== PERMISSIONS.OWNER_ACCESS) return true;
  return user.permissions.includes(permission);
};

// --- INITIAL DATA (UPDATED) ---
const INITIAL_ROLES: AppRole[] = [
  { id: 'role-0', name: 'OWNER', description: 'Dueño del Sistema', permissions: AVAILABLE_PERMISSIONS },
  { id: 'role-1', name: 'ADMIN', description: 'Administrador General', permissions: AVAILABLE_PERMISSIONS.filter(p => p !== PERMISSIONS.OWNER_ACCESS) },
  { id: 'role-2', name: 'SALES', description: 'Vendedor', permissions: [PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.PACKAGES_VIEW, PERMISSIONS.PRICES_VIEW, PERMISSIONS.RESERVATIONS_VIEW, PERMISSIONS.RESERVATIONS_MANAGE, PERMISSIONS.STATS_PERSONAL_VIEW] },
  { id: 'role-3', name: 'VENDOR', description: 'Proveedor', permissions: [PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.RESERVATIONS_VIEW] }
];

const INITIAL_USERS: AppUser[] = [
  { id: '1', name: 'Dueño Floripa', email: 'info.floripafacil@gmail.com', roleName: 'OWNER', isActive: true, permissions: [] },
  { id: '2', name: 'Admin General', email: 'admin@floripa.com', roleName: 'ADMIN', isActive: true, permissions: [] },
  { id: '3', name: 'Vendedor Top', email: 'ventas@floripa.com', roleName: 'SALES', isActive: true, permissions: [] },
  { id: '4', name: 'Transporte X', email: 'proveedor@floripa.com', roleName: 'VENDOR', isActive: true, permissions: [] },
];

const INITIAL_LOGS: Log[] = [
  { id: '1', user: 'Dueño Floripa', action: 'LOGIN', target: 'System', date: 'Hace 5 min' },
  { id: '2', user: 'Vendedor Top', action: 'CREATE_RESERVATION', target: 'Traslado #8821', date: 'Hace 1 hora' },
  { id: '3', user: 'Admin General', action: 'UPDATE_PACKAGE', target: 'Barco Pirata Full', date: 'Hace 2 horas' },
];

const INITIAL_SALES: Sale[] = [
  { id: 's1', sellerId: '3', sellerName: 'Vendedor Top', amount: 250, commission: 25, date: '2023-10-01' },
  { id: 's2', sellerId: '3', sellerName: 'Vendedor Top', amount: 150, commission: 15, date: '2023-10-02' },
  { id: 's3', sellerId: '2', sellerName: 'Admin General', amount: 400, commission: 0, date: '2023-10-03' },
];

// Fallback data if fetch fails
const FALLBACK_HERO_IMAGES = [
  "https://images.unsplash.com/photo-1596443686812-2f45229eeb33?q=80&w=2071"
];

// --- DESIGN SYSTEM & UI COMPONENTS (REFACTORED FOR CONSISTENCY) ---

// Consistent Palette: Ocean Blue & Brazil Emerald
const COLORS = { 
  primary: 'bg-blue-600', 
  primaryHover: 'hover:bg-blue-700',
  secondary: 'bg-emerald-50', 
  secondaryHover: 'hover:bg-emerald-600',
  textDark: 'text-slate-900',
  textLight: 'text-slate-500',
  accent: 'text-amber-400' 
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dark' | 'shimmer';
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
}

// Unified Button Component
const Button = ({ children, variant = 'primary', className = '', ...props }: ButtonProps) => {
  const base = "inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide";
  
  const variants = {
    primary: `${COLORS.primary} ${COLORS.primaryHover} text-white shadow-md shadow-blue-600/20 focus:ring-blue-500`,
    secondary: `${COLORS.secondary} ${COLORS.secondaryHover} text-white shadow-md shadow-emerald-500/20 focus:ring-emerald-500`,
    outline: "border border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-600 bg-white focus:ring-slate-200",
    ghost: "text-slate-600 hover:bg-slate-50 hover:text-blue-600 focus:ring-slate-200",
    danger: "bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 focus:ring-red-200",
    dark: "bg-slate-900 hover:bg-slate-800 text-white shadow-lg focus:ring-slate-700",
    shimmer: "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-[length:200%_100%] animate-[shimmer_3s_infinite] text-white shadow-lg shadow-blue-500/40 border border-blue-400/20"
  };
  
  return <button className={`${base} ${variants[variant || 'primary']} ${className}`} {...props}>{children}</button>;
};

interface CardProps {
  children?: ReactNode;
  className?: string;
  noPadding?: boolean;
  key?: React.Key | null | undefined;
}

// Unified Card Component
const Card = ({ children, className = '', noPadding = false }: CardProps) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden ${noPadding ? '' : 'p-6'} ${className}`}>
    {children}
  </div>
);

// --- NEW COMPONENT: ACTIVITY CARD (OPTIMIZED COPY) ---
interface ActivityCardProps {
  title: string;
  subtitle: string;
  includes: string[];
  details: string[];
  price: string;
  tag?: string;
  onClick?: () => void;
}

const ActivityCard = ({ title, subtitle, includes, details, price, tag, onClick }: ActivityCardProps) => (
  <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform">
    <div className="bg-slate-50 p-5 border-b border-slate-100 flex justify-between items-start">
      <div>
        {tag && (
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full mb-3 inline-block ${
            tag.includes('Traslado') ? 'bg-blue-100 text-blue-700' : 
            tag.includes('Combo') ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
            {tag}
          </span>
        )}
        <h3 className="text-xl font-extrabold text-slate-900 leading-tight">{title}</h3>
      </div>
    </div>
    <div className="p-6 flex-1 flex flex-col">
      <p className="text-slate-600 text-sm font-medium mb-5 italic border-l-4 border-emerald-400 pl-3 leading-relaxed">{subtitle}</p>
      
      <div className="space-y-4 mb-6 flex-1">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><CheckCircle size={12}/> Incluye:</p>
        <ul className="space-y-2.5">
          {includes.map((item, i) => (
            <li key={i} className="flex items-start text-sm text-slate-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 mr-2.5 flex-shrink-0"></span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6 py-3 px-4 bg-slate-50 rounded-xl text-xs text-slate-500 space-y-1.5 border border-slate-100">
         {details.map((d, i) => <div key={i} className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-300 rounded-full"></div>{d}</div>)}
      </div>

      <div className="mt-auto pt-5 border-t border-slate-100">
        <div className="flex justify-between items-end mb-4">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wide">Precio desde</span>
          <span className="text-3xl font-black text-slate-900 tracking-tight">{price}</span>
        </div>
        <Button onClick={onClick} className="w-full justify-center group !py-3.5 !text-sm !shadow-none hover:!shadow-lg">
          Reservar Cupo <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform"/>
        </Button>
      </div>
    </div>
  </div>
);

interface BadgeProps {
  children?: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  className?: string;
}

// Unified Badge Component
const Badge = ({ children, variant = 'info', className = '' }: BadgeProps) => {
  const variants = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    error: "bg-red-50 text-red-700 border-red-100",
    info: "bg-blue-50 text-blue-700 border-blue-100",
    neutral: "bg-slate-100 text-slate-600 border-slate-200"
  };
  return <span className={`px-2.5 py-1 rounded-md text-xs font-bold border flex items-center gap-1.5 w-fit uppercase tracking-wider ${variants[variant || 'info']} ${className}`}>{children}</span>;
};

interface SectionProps {
  children?: ReactNode;
  className?: string;
  bg?: 'white' | 'gray';
}

// Section Layout Wrapper (Crucial for Max Width Fix)
const Section = ({ children, className = '', bg = 'white' }: SectionProps) => (
  <section className={`py-16 md:py-24 ${bg === 'gray' ? 'bg-slate-50' : 'bg-white'} ${className}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  </section>
);

interface HeadingProps {
  children?: ReactNode;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}

const Heading = ({ children, subtitle, align = 'center', className = '' }: HeadingProps) => (
  <div className={`mb-12 ${align === 'center' ? 'text-center' : 'text-left'} ${className}`}>
    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">{children}</h2>
    {subtitle && <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
  </div>
);

// --- NEW COMPONENT: HERO SLIDER ---
interface HeroSliderProps {
  images: string[];
}

const HeroSlider = ({ images }: HeroSliderProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) return <div className="absolute inset-0 bg-slate-900"></div>;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((img, i) => (
        <div 
          key={i} 
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url('${img}')` }}
        />
      ))}
      {/* Universal Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/80"></div>
    </div>
  );
};

// --- LAYOUT COMPONENTS ---

interface PublicNavbarProps {
  setView: (view: { name: string; params: any }) => void;
  logoUrl: string | null;
}

const PublicNavbar = ({ setView, logoUrl }: PublicNavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <div className="cursor-pointer flex items-center gap-2.5" onClick={() => setView({ name: 'HOME', params: null })}>
          {logoUrl ? (
             <img src={logoUrl} alt="Floripa Facil" className="h-14 w-auto object-contain transition-all hover:scale-105" />
          ) : (
            <>
              <div className={`p-2 rounded-lg transition-colors ${scrolled ? 'bg-blue-600 text-white' : 'bg-white/20 text-white backdrop-blur-sm'}`}>
                <Bus size={22} fill="currentColor" strokeWidth={2.5}/>
              </div>
              <div>
                <span className={`text-xl font-black tracking-tight block leading-none ${scrolled ? 'text-slate-900' : 'text-white drop-shadow-md'}`}>FLORIPA FÁCIL</span>
              </div>
            </>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {['Inicio', 'Traslados', 'Excursiones', 'Destinos', 'Contacto'].map(item => (
            <button key={item} className={`font-semibold text-sm hover:text-blue-500 transition-colors ${scrolled ? 'text-slate-600' : 'text-white/90 hover:text-white drop-shadow-sm'}`}>
              {item}
            </button>
          ))}
          <Button 
            variant={scrolled ? 'primary' : 'secondary'} 
            onClick={() => setView({ name: 'ADMIN_LOGIN', params: null })}
            className="!py-2 !px-5 !rounded-full !text-xs !font-bold uppercase tracking-wider shadow-lg"
          >
            Acceso Staff
          </Button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`${scrolled ? 'text-slate-900' : 'text-white'}`}>
             {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl p-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
           {['Inicio', 'Traslados', 'Excursiones', 'Destinos'].map(item => (
            <button key={item} className="text-left font-semibold text-slate-700 py-2 border-b border-slate-50">{item}</button>
           ))}
           <Button onClick={() => setView({ name: 'ADMIN_LOGIN', params: null })} className="w-full">Acceso Staff</Button>
        </div>
      )}
    </nav>
  );
};

// --- LANDING PAGES (RESTORED DESIGN & UX PIVOT) ---

interface LandingPageProps {
  setView: (view: { name: string; params: any }) => void;
  onTrack: (event: 'views' | 'ctaClicks' | 'whatsappStarts') => void;
  heroImages: string[];
  activities: any[];
}

// VARIANT A: ORIGINAL (Classic & Clean)
const LandingPageA = ({ setView, onTrack, heroImages, activities }: LandingPageProps) => {
  useEffect(() => { onTrack('views'); }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* HERO SECTION WITH SLIDER */}
      <div className="relative h-[85vh] w-full bg-slate-900 overflow-hidden">
        <HeroSlider images={heroImages} />
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight drop-shadow-xl">
              Traslados y Excursiones <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-emerald-300 to-blue-300">en Brasil</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-10 leading-relaxed max-w-2xl mx-auto font-medium drop-shadow-sm">
              Organizamos tu llegada y tus paseos en Florianópolis, Bombinhas y Camboriú. 
              Disfrutá sin preocupaciones de logística.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
              <Button onClick={() => onTrack('ctaClicks')} variant="primary" className="!text-base !py-4 !px-8 shadow-blue-900/40">
                <Bus size={18} className="mr-2"/> Reservar Traslado
              </Button>
              <Button onClick={() => onTrack('whatsappStarts')} variant="outline" className="!bg-white/10 !text-white !border-white/40 hover:!bg-white hover:!text-slate-900 backdrop-blur-sm !text-base !py-4 !px-8">
                <Camera size={18} className="mr-2"/> Ver Excursiones
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* QUE HACEMOS SECTION */}
      <Section>
        <Heading subtitle="Servicios pensados para que te relajes apenas pisás Brasil.">¿Cómo te ayudamos?</Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-all text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Bus size={32}/>
            </div>
            <h3 className="text-xl font-bold mb-2">Traslados Aeropuerto</h3>
            <p className="text-slate-500 mb-4">Te buscamos en el aeropuerto y te llevamos directo a la puerta de tu alojamiento.</p>
            <span className="text-blue-600 font-bold text-sm">Ver opciones &rarr;</span>
          </Card>
          <Card className="hover:shadow-lg transition-all text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Palmtree size={32}/>
            </div>
            <h3 className="text-xl font-bold mb-2">Excursiones y Paseos</h3>
            <p className="text-slate-500 mb-4">Barco Pirata, City Tours y visitas a playas paradisíacas. Viví la experiencia completa.</p>
            <span className="text-emerald-600 font-bold text-sm">Ver excursiones &rarr;</span>
          </Card>
          <Card className="hover:shadow-lg transition-all text-center">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Split size={32}/>
            </div>
            <h3 className="text-xl font-bold mb-2">Combos de Actividades</h3>
            <p className="text-slate-500 mb-4">Paquetes de traslado + paseos para resolver toda tu logística en una sola compra.</p>
            <span className="text-amber-600 font-bold text-sm">Ver combos &rarr;</span>
          </Card>
        </div>
      </Section>

      {/* ACTIVITIES GRID FOR VARIANT A (NEW ADDITION) */}
      <Section bg="gray">
        <Heading subtitle="Combos y traslados más solicitados.">Actividades Destacadas</Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {activities && activities.length > 0 ? activities.map((act) => (
             <ActivityCard 
               key={act.id}
               tag={act.tag}
               title={act.title}
               subtitle={act.subtitle}
               includes={act.includes}
               details={act.details}
               price={act.price}
               onClick={() => onTrack('ctaClicks')}
             />
           )) : <div className="col-span-3 text-center text-slate-400">Cargando actividades...</div>}
        </div>
      </Section>

      {/* DESTINOS SECTION */}
      <Section>
        <Heading subtitle="Operamos con proveedores locales verificados en los principales destinos.">Nuestros Destinos</Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Florianópolis', img: 'https://images.unsplash.com/photo-1626017088062-8e31a9863266?q=80&w=2070', desc: 'Traslados desde aeropuerto y paseos en la isla.' },
            { title: 'Bombinhas', img: 'https://images.unsplash.com/photo-1563116640-1a221f00882e?q=80&w=2070', desc: 'Tours de playas, buceo y traslados directos.' },
            { title: 'Camboriú', img: 'https://images.unsplash.com/photo-1555992984-25785a720db1?q=80&w=1974', desc: 'Parque Unipraias, traslados nocturnos y tours.' }
          ].map((dest, i) => (
            <div key={i} className="group relative rounded-2xl overflow-hidden shadow-lg aspect-[3/4] cursor-pointer ring-1 ring-slate-900/5">
              <div className={`absolute inset-0 bg-[url('${dest.img}')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110`}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              <div className="absolute bottom-0 p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">{dest.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">{dest.desc}</p>
                <div className="inline-flex items-center text-emerald-400 text-sm font-bold border-b border-emerald-400/0 group-hover:border-emerald-400 pb-0.5 transition-all">
                  Ver actividades en {dest.title} <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform"/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 text-white mb-6">
               <Bus size={24} className="text-blue-500 fill-blue-500"/>
               <span className="text-xl font-black tracking-tight">FLORIPA FÁCIL</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">Expertos en logística turística y actividades en el sur de Brasil. Facilitamos tu experiencia en destino.</p>
          </div>
          <div>
            <h5 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Servicios</h5>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Traslados Aeropuerto</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Excursiones de Día</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Paseos en Barco</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Combos de Aventura</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Empresa</h5>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Contacto</h5>
            <Button variant="secondary" className="w-full mb-4 !text-sm">
              <MessageCircle size={16} className="mr-2"/> WhatsApp Ventas
            </Button>
            <p className="text-sm text-center">info@floripafacil.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// VARIANT B: OPTIMIZED (Conversion Focused)
const LandingPageB = ({ setView, onTrack, heroImages, activities }: LandingPageProps) => {
  useEffect(() => { onTrack('views'); }, []);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-emerald-100 selection:text-emerald-800">
      {/* HERO SECTION B - SPLIT LAYOUT WITH SLIDER */}
      <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-slate-900">
         {/* Background Slider */}
        <HeroSlider images={heroImages} />
        
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-900 font-bold text-xs mb-6 shadow-[0_0_20px_rgba(251,191,36,0.4)]">
               <Star size={12} fill="currentColor" /> 4.9/5 - Logística y Tours en Brasil
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
              Disfrutá Brasil <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">sin estrés</span>
            </h1>
            <h2 className="text-xl md:text-2xl font-medium text-slate-300 mb-8 max-w-lg leading-relaxed">
              Coordinamos tu llegada y tus paseos. <span className="text-white font-bold">Vos solo preocupate por descansar.</span>
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button onClick={() => onTrack('whatsappStarts')} variant="shimmer" className="!text-lg !px-10 !py-4 shadow-xl hover:-translate-y-1 transform transition-all">
                <MessageCircle size={20} className="mr-2"/> Cotizar Traslado/Tour
              </Button>
              <Button onClick={() => onTrack('ctaClicks')} variant="ghost" className="!text-slate-300 hover:!bg-white/5 hover:!text-white !text-base !px-6 border border-slate-700">
                Ver Actividades
              </Button>
            </div>

            {/* TRUST INDICATORS */}
            <div className="flex flex-wrap gap-6 text-sm text-slate-400 font-medium">
              <div className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400"/> Vehículos Habilitados</div>
              <div className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400"/> Seguro de Pasajero</div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE ICONS BAR */}
      <div className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center lg:justify-between gap-8 text-center md:text-left">
           {[
             {icon: Users, text: "Atención personalizada en Español"},
             {icon: CreditCard, text: "Reservas con solo 40% de anticipo"},
             {icon: Bus, text: "Traslados puerta a puerta"},
             {icon: Camera, text: "Las mejores excursiones"}
           ].map((f, i) => (
             <div key={i} className="flex flex-col md:flex-row items-center gap-3 text-slate-700 font-bold text-sm">
               <div className="p-2.5 bg-slate-50 rounded-lg shadow-sm text-blue-600 border border-slate-100"><f.icon size={20}/></div>
               {f.text}
             </div>
           ))}
        </div>
      </div>

      {/* SOCIAL PROOF SECTION */}
      <Section>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="warning" className="mx-auto mb-4">Opiniones</Badge>
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Experiencias Reales</h2>
          <div className="flex justify-center gap-1 text-amber-400 mb-2">
            {[1,2,3,4,5].map(s => <Star key={s} size={24} fill="currentColor"/>)}
          </div>
          <p className="text-slate-500">Lo que dicen quienes contrataron nuestros traslados y tours.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {name: "Camila R.", type: "Pareja", text: "El traslado desde el aeropuerto fue súper puntual. El chofer nos esperó con cartel y nos llevó directo al dpto."},
            {name: "Juan P.", type: "Familia", text: "Contratamos el Barco Pirata y el tour a playas. Excelente organización y los guías muy buena onda."},
            {name: "Sofia M.", type: "Amigos", text: "Ya teníamos el hotel, así que Floripa Fácil nos resolvió toda la movilidad. Muy recomendados."}
          ].map((t, i) => (
             <Card key={i} className="bg-slate-50 border-none h-full flex flex-col justify-between">
               <div>
                 <div className="flex gap-0.5 text-amber-400 mb-4">
                   {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor"/>)}
                 </div>
                 <p className="text-slate-700 italic mb-6 leading-relaxed">"{t.text}"</p>
               </div>
               <div className="border-t border-slate-200 pt-4 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">{t.name[0]}</div>
                 <div>
                   <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                   <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">{t.type}</p>
                 </div>
               </div>
             </Card>
          ))}
        </div>
      </Section>

      {/* ACTIVITIES GRID (Using New ActivityCard) */}
      <Section bg="gray">
        <Heading subtitle="Combos de actividades y logística más vendidos">Actividades Top</Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {activities && activities.length > 0 ? activities.map((act) => (
             <ActivityCard 
               key={act.id}
               tag={act.tag}
               title={act.title}
               subtitle={act.subtitle}
               includes={act.includes}
               details={act.details}
               price={act.price}
               onClick={() => onTrack('ctaClicks')}
             />
           )) : <div className="col-span-3 text-center text-slate-400">Cargando actividades...</div>}
        </div>
      </Section>

      {/* CTA FOOTER */}
      <section className="bg-blue-600 relative overflow-hidden text-white py-20 text-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Ya tenés el hotel... ¿Y el resto?</h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">Reservá tus traslados y excursiones hoy mismo y completá tu viaje a Brasil.</p>
          <Button onClick={() => onTrack('whatsappStarts')} variant="secondary" className="!bg-white !text-blue-600 hover:!bg-blue-50 !text-lg !px-10 !py-4 shadow-xl border-2 border-white/20">
             <MessageCircle size={20} className="mr-2"/> Hablar con un Asesor
          </Button>
        </div>
      </section>

      {/* SIMPLE FOOTER */}
      <footer className="bg-slate-950 text-slate-500 py-8 text-center text-sm">
        <p>© 2024 Floripa Fácil. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};


// --- DASHBOARD COMPONENTS (CLEANED UP & STANDARDIZED) ---

// Component: Web Config (New for managing Hero Images)
interface WebConfigProps {
  heroImages: string[];
  setHeroImages: (images: string[]) => void;
  logoUrl: string | null;
  setLogoUrl: (url: string) => void;
}

const WebConfig = ({ heroImages, setHeroImages, logoUrl, setLogoUrl }: WebConfigProps) => {
  const [newUrl, setNewUrl] = useState('');
  const [newLogoUrl, setNewLogoUrl] = useState(logoUrl || '');

  const addImage = () => {
    if (newUrl) {
      setHeroImages([...heroImages, newUrl]);
      setNewUrl('');
    }
  };

  const removeImage = (index: number) => {
    const newImages = heroImages.filter((_, i) => i !== index);
    setHeroImages(newImages);
  };

  const saveLogo = () => {
    setLogoUrl(newLogoUrl);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center">
             <Layout className="mr-3 text-blue-600" size={28}/> Configuración Web
          </h2>
          <p className="text-slate-500 text-sm mt-1">Gestiona el contenido visible de la página principal.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
         {/* LOGO MANAGER */}
         <Card>
          <h3 className="font-bold text-slate-800 mb-6 flex items-center">
            <Star className="mr-2 text-slate-400" size={20}/> Logo del Sitio
          </h3>
          <div className="flex flex-col md:flex-row gap-6 items-start">
             <div className="flex-1 w-full">
                <label className="block text-sm text-slate-500 mb-2 font-medium">URL del Logo (o ruta local ej: /logo.png)</label>
                <div className="flex gap-2">
                   <input 
                      value={newLogoUrl} 
                      onChange={(e) => setNewLogoUrl(e.target.value)}
                      placeholder="/logo.png" 
                      className="flex-1 border border-slate-200 bg-slate-50 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                   />
                   <Button onClick={saveLogo}>Guardar</Button>
                </div>
                <p className="text-xs text-slate-400 mt-2">Sube tu archivo a la carpeta 'public' y escribe el nombre aquí.</p>
             </div>
             <div className="p-4 bg-slate-100 rounded-lg flex items-center justify-center min-w-[150px] min-h-[80px] border border-slate-200 border-dashed">
                {logoUrl ? <img src={logoUrl} className="h-12 w-auto object-contain" alt="Logo Preview" /> : <span className="text-xs text-slate-400">Sin Logo</span>}
             </div>
          </div>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* HERO IMAGE MANAGER */}
        <Card>
          <h3 className="font-bold text-slate-800 mb-6 flex items-center">
            <ImageIcon className="mr-2 text-slate-400" size={20}/> Imágenes del Banner Principal
          </h3>
          <div className="mb-6 flex gap-2">
            <input 
              value={newUrl} 
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Pegar URL de imagen (Unsplash, etc)" 
              className="flex-1 border border-slate-200 bg-slate-50 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
            <Button onClick={addImage}><Plus size={18}/></Button>
          </div>
          
          <div className="space-y-3">
            {heroImages.map((img, i) => (
              <div key={i} className="flex items-center justify-between p-2 border border-slate-100 rounded-lg hover:bg-slate-50">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img src={img} className="w-12 h-8 object-cover rounded shadow-sm" alt="hero preview"/>
                  <span className="text-xs text-slate-500 truncate max-w-[200px]">{img}</span>
                </div>
                <button onClick={() => removeImage(i)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                  <Trash2 size={16}/>
                </button>
              </div>
            ))}
            {heroImages.length === 0 && <p className="text-sm text-slate-400 italic text-center py-4">No hay imágenes. Se mostrará fondo negro.</p>}
          </div>
        </Card>

        {/* PREVIEW */}
        <Card className="bg-slate-900 relative overflow-hidden min-h-[300px] flex items-center justify-center">
          <HeroSlider images={heroImages} />
          <div className="relative z-10 text-center p-6 pointer-events-none">
            <h2 className="text-3xl font-extrabold text-white mb-2 drop-shadow-xl">Vista Previa</h2>
            <p className="text-slate-200">Así se ve el fondo detrás del título principal.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};


// A/B Dashboard
const ABTestDashboard = () => {
  const [data, setData] = useState<ABTestResult | null>(null);

  useEffect(() => {
    getABTestResults().then(setData);
  }, []);

  if (!data) return <div className="p-8 text-center text-slate-400 animate-pulse">Analizando datos del experimento...</div>;

  const getCR = (v: ABMetrics) => ((v.reservations / v.views) * 100).toFixed(2);
  const getCTR = (v: ABMetrics) => ((v.ctaClicks / v.views) * 100).toFixed(2);

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center">
             <Split className="mr-3 text-purple-600" size={28}/> A/B Testing: Landing Page
          </h2>
          <p className="text-slate-500 text-sm mt-1">Comparativa de rendimiento en tiempo real: Control vs Optimizado.</p>
        </div>
        <div className="flex gap-2">
           <Badge variant={data.winner === 'B' ? 'success' : data.winner === 'A' ? 'warning' : 'neutral'}>
             {data.winner === 'B' ? '🚀 Variante B Ganando' : data.winner === 'A' ? '🛡️ Control Ganando' : '⚖️ Empate Técnico'}
           </Badge>
           <Badge variant="info">Confianza: {data.confidence}%</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* VARIANT A CARD */}
        <Card className={`relative overflow-hidden ${data.winner === 'A' ? 'ring-2 ring-emerald-500' : ''}`}>
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-700 flex items-center"><Shield size={18} className="mr-2"/> Variante A (Control)</h3>
             <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold">ORIGINAL</span>
           </div>
           <div className="grid grid-cols-2 gap-4 mb-6">
             <div className="p-4 bg-slate-50 rounded-xl">
               <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Conversión</p>
               <p className="text-2xl font-black text-slate-800">{getCR(data.variantA)}%</p>
             </div>
             <div className="p-4 bg-slate-50 rounded-xl">
               <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">CTR Botones</p>
               <p className="text-2xl font-black text-slate-800">{getCTR(data.variantA)}%</p>
             </div>
           </div>
           <div className="space-y-3 text-sm">
             <div className="flex justify-between border-b border-slate-100 pb-2">
               <span className="text-slate-500">Visitas Totales</span>
               <span className="font-medium">{data.variantA.views}</span>
             </div>
             <div className="flex justify-between border-b border-slate-100 pb-2">
               <span className="text-slate-500">Inicios WhatsApp</span>
               <span className="font-medium">{data.variantA.whatsappStarts}</span>
             </div>
             <div className="flex justify-between pt-1">
               <span className="text-slate-900 font-bold">Reservas Finales</span>
               <span className="font-bold text-blue-600">{data.variantA.reservations}</span>
             </div>
           </div>
        </Card>

        {/* VARIANT B CARD */}
        <Card className={`relative overflow-hidden ${data.winner === 'B' ? 'ring-2 ring-emerald-500' : ''}`}>
           {data.winner === 'B' && <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Mejor Rendimiento</div>}
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-700 flex items-center"><Trophy size={18} className="mr-2 text-amber-500"/> Variante B (Test)</h3>
             <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded border border-purple-200 font-bold">OPTIMIZADO</span>
           </div>
           <div className="grid grid-cols-2 gap-4 mb-6">
             <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
               <p className="text-xs text-purple-400 uppercase font-bold tracking-wider">Conversión</p>
               <p className="text-2xl font-black text-purple-800">{getCR(data.variantB)}%</p>
               {data.uplift > 0 && <span className="text-xs font-bold text-emerald-600">+{data.uplift.toFixed(1)}% mejora</span>}
             </div>
             <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
               <p className="text-xs text-purple-400 uppercase font-bold tracking-wider">CTR Botones</p>
               <p className="text-2xl font-black text-purple-800">{getCTR(data.variantB)}%</p>
             </div>
           </div>
           <div className="space-y-3 text-sm">
             <div className="flex justify-between border-b border-slate-100 pb-2">
               <span className="text-slate-500">Visitas Totales</span>
               <span className="font-medium">{data.variantB.views}</span>
             </div>
             <div className="flex justify-between border-b border-slate-100 pb-2">
               <span className="text-slate-500">Inicios WhatsApp</span>
               <span className="font-medium">{data.variantB.whatsappStarts}</span>
             </div>
             <div className="flex justify-between pt-1">
               <span className="text-slate-900 font-bold">Reservas Finales</span>
               <span className="font-bold text-purple-600">{data.variantB.reservations}</span>
             </div>
           </div>
        </Card>
      </div>
    </div>
  );
};

interface KPICardProps {
  title: string;
  value: string | number;
  subtext: string;
  trend?: number;
  icon: any; 
  colorClass: string;
  trendColor?: string;
}

// Finance KPI Card
const KPICard = ({ title, value, subtext, trend, icon: Icon, colorClass, trendColor }: KPICardProps) => (
  <Card className="hover:shadow-md transition-shadow relative overflow-hidden group">
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-black text-slate-800 mt-1 tracking-tight group-hover:text-blue-600 transition-colors">{value}</h3>
      </div>
      <div className={`p-2.5 rounded-lg ${colorClass} bg-opacity-10`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="flex items-center text-xs font-medium relative z-10">
      {trend !== undefined && (
        trend > 0 ? (
          <span className="text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded mr-2 border border-emerald-100">
            <TrendingUp size={12} className="mr-1"/> +{trend.toFixed(1)}%
          </span>
        ) : (
          <span className="text-red-600 flex items-center bg-red-50 px-1.5 py-0.5 rounded mr-2 border border-red-100">
            <TrendingDown size={12} className="mr-1"/> {trend.toFixed(1)}%
          </span>
        )
      )}
      <span className="text-slate-400">{subtext}</span>
    </div>
  </Card>
);

const FinanceDashboard = () => {
  const [data, setData] = useState<FinancialReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFinancialReport().then(report => {
      setData(report);
      setLoading(false);
    });
  }, []);

  if (loading || !data) return <div className="p-10 text-center text-slate-400 animate-pulse">Cargando datos financieros del CEO...</div>;

  return (
    <div className="space-y-8 animate-in fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center">Finanzas CEO</h2>
          <p className="text-slate-500 text-sm mt-1">Visión estratégica de rentabilidad y crecimiento.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {data.alerts.map((alert, idx) => (
            <div key={idx} className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-sm animate-pulse border ${alert.type === 'negative' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
              <AlertTriangle size={12} className="mr-1.5"/> {alert.title}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Facturación Mes" value={`$${data.kpis.revenue.total.toLocaleString()}`} trend={data.kpis.revenue.growth} subtext="vs mes anterior" icon={DollarSign} colorClass="text-blue-600 bg-blue-100" trendColor="text-emerald-600" />
        <KPICard title="Margen Neto" value={`${data.kpis.margin.average.toFixed(1)}%`} trend={data.kpis.margin.average - 30} subtext="Objetivo: 35%" icon={Activity} colorClass={data.kpis.margin.status === 'good' ? "text-emerald-600 bg-emerald-100" : "text-red-600 bg-red-100"} trendColor="" />
        <KPICard title="Comisiones" value={`$${data.kpis.commission.total.toLocaleString()}`} trend={1.2} subtext={`${data.kpis.commission.percentage.toFixed(1)}% de ventas`} icon={Users} colorClass="text-purple-600 bg-purple-100" trendColor="" />
        <KPICard title="Resultado Neto" value={`$${data.kpis.netProfit.total.toLocaleString()}`} trend={5.4} subtext="Beneficio operativo" icon={PieIcon} colorClass="text-teal-600 bg-teal-100" trendColor="" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-slate-800">Evolución de Ingresos</h3>
             <Badge variant="neutral">Últimos 6 meses</Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueHistory}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0"/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} tick={{fill: '#64748B', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}} formatter={(val: number) => [`$${val.toLocaleString()}`, '']} />
                <Legend />
                <Area type="monotone" dataKey="revenue" name="Ingresos" stroke="#2563EB" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                <Line type="monotone" dataKey="profit" name="Beneficio" stroke="#10B981" strokeWidth={3} dot={{r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff'}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
          <h3 className="font-bold text-white mb-6 flex items-center"><Star className="mr-2 text-amber-400" size={18}/> Análisis IA</h3>
          <div className="space-y-4">
            {data.insights.map((insight, idx) => (
              <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/5 backdrop-blur-sm relative overflow-hidden">
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${insight.type === 'positive' ? 'bg-emerald-400' : 'bg-blue-400'}`}></div>
                <h4 className="font-bold text-sm text-white mb-1">{insight.title}</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{insight.message}</p>
              </div>
            ))}
            <div className="p-4 bg-blue-600/20 rounded-xl border border-blue-500/30 mt-4">
               <h4 className="font-bold text-sm text-blue-200 mb-2">Producto Top</h4>
               <div className="flex justify-between items-center">
                 <span className="text-sm text-white">Combo Barco + Traslado</span>
                 <span className="font-bold text-white">65% Ventas</span>
               </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="font-bold text-slate-800 mb-6">Rentabilidad por Destino</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.profitabilityByDestination} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fill: '#475569'}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="margin" name="Margen %" radius={[0, 4, 4, 0]} barSize={24}>
                  {data.profitabilityByDestination.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.margin > 40 ? '#10B981' : entry.margin < 30 ? '#EF4444' : '#F59E0B'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card noPadding>
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Performance Vendedores</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3 text-left pl-6">Vendedor</th>
                  <th className="p-3 text-right">Ventas</th>
                  <th className="p-3 text-right pr-6">Ticket Prom.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.sellerPerformance.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 pl-6 font-medium text-slate-700">{s.name}</td>
                    <td className="p-3 text-right font-bold text-slate-900">${s.revenue.toLocaleString()}</td>
                    <td className="p-3 text-right pr-6 text-slate-500">${Math.round(s.ticket)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-slate-800 mb-2">Mix de Productos</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.productMix}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.productMix.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#6366F1'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                </PieChart>
             </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

interface UserManagementProps {
  users: AppUser[];
  setUsers: (users: AppUser[]) => void;
  roles: AppRole[];
  currentUser: AppUser;
}

const UserManagement = ({ users, setUsers, roles, currentUser }: UserManagementProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleCreateUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUser: AppUser = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      roleName: formData.get('role') as string,
      isActive: true,
      permissions: [] 
    };
    setUsers([...users, newUser]);
    setIsModalOpen(false);
  };

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Usuarios</h2>
          <p className="text-slate-500 text-sm">Gestiona el acceso y roles del equipo.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <UserPlus size={18} className="mr-2" /> Crear Usuario
        </Button>
      </div>

      <Card noPadding>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <tr><th className="p-4 pl-6">Usuario</th><th className="p-4">Rol</th><th className="p-4">Estado</th><th className="p-4 text-right pr-6">Acciones</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 pl-6">
                  <div className="font-bold text-slate-800">{u.name}</div>
                  <div className="text-xs text-slate-400">{u.email}</div>
                </td>
                <td className="p-4"><Badge variant="neutral">{u.roleName}</Badge></td>
                <td className="p-4">
                  {u.isActive ? 
                    <Badge variant="success"><UserCheck size={12} className="mr-1"/> Activo</Badge> : 
                    <Badge variant="error"><UserX size={12} className="mr-1"/> Inactivo</Badge>
                  }
                </td>
                <td className="p-4 text-right pr-6">
                  {u.id !== currentUser.id && u.roleName !== 'OWNER' && (
                    <button onClick={() => toggleStatus(u.id)} className="text-slate-400 hover:text-blue-600 font-medium text-sm transition-colors">
                      {u.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md !p-8 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold mb-1 text-slate-900">Nuevo Usuario</h3>
            <p className="text-sm text-slate-500 mb-6">Ingresa los datos para dar de alta un acceso.</p>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input name="name" placeholder="Nombre Completo" required className="w-full border border-slate-200 bg-slate-50 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              <input name="email" type="email" placeholder="Email" required className="w-full border border-slate-200 bg-slate-50 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              <div className="grid grid-cols-2 gap-4">
                <select name="role" className="w-full border border-slate-200 bg-slate-50 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-700">
                  {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                </select>
                <input name="password" type="password" placeholder="Pass Temp" required className="w-full border border-slate-200 bg-slate-50 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 mt-4">
                <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button>Crear Usuario</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

interface AnalyticsDashboardProps {
  sales: Sale[];
  users: AppUser[];
  currentUser: AppUser;
}

const AnalyticsDashboard = ({ sales, users, currentUser }: AnalyticsDashboardProps) => {
  const isGlobal = can(currentUser, PERMISSIONS.STATS_GLOBAL_VIEW);
  const filteredSales = isGlobal ? sales : sales.filter(s => s.sellerId === currentUser.id);

  const totalSales = filteredSales.reduce((sum, s) => sum + s.amount, 0);
  const totalCommission = filteredSales.reduce((sum, s) => sum + s.commission, 0);

  const ranking = Object.entries(sales.reduce((acc: any, sale) => {
    acc[sale.sellerName] = (acc[sale.sellerName] || 0) + sale.amount;
    return acc;
  }, {})).sort((a:any, b:any) => b[1] - a[1]);

  return (
    <div className="space-y-8 animate-in fade-in">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center">Dashboard Operativo</h2>
          <p className="text-slate-500 text-sm mt-1">Resumen de actividad diaria y ventas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title="Ventas Totales" value={`$${totalSales.toLocaleString()}`} icon={DollarSign} colorClass="text-blue-600 bg-blue-100" subtext="Acumulado periodo" trend={12.5} trendColor=""/>
        <KPICard title="Comisiones" value={`$${totalCommission.toLocaleString()}`} icon={BarChart3} colorClass="text-emerald-600 bg-emerald-100" subtext="Ganancia vendedores" trend={8.2} trendColor=""/>
        <KPICard title="Operaciones" value={filteredSales.length} icon={CheckCircle} colorClass="text-purple-600 bg-purple-100" subtext="Ventas cerradas" trend={-2.4} trendColor=""/>
      </div>

      {isGlobal && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
             <h3 className="font-bold text-slate-800 mb-6 flex items-center"><Trophy className="mr-2 text-amber-400" size={20}/> Ranking de Vendedores</h3>
             <div className="space-y-4">
               {ranking.map(([name, amount]: any, idx) => (
                 <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                   <div className="flex items-center">
                     <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 shadow-sm ${idx === 0 ? 'bg-amber-100 text-amber-700' : 'bg-white text-slate-500'}`}>#{idx + 1}</span>
                     <span className="font-bold text-slate-700">{name}</span>
                   </div>
                   <span className="font-black text-slate-900">${amount.toLocaleString()}</span>
                 </div>
               ))}
             </div>
          </Card>
          <Card>
            <h3 className="font-bold text-slate-800 mb-6">Últimas Ventas</h3>
            <div className="space-y-3">
              {sales.slice(0, 5).map(s => (
                <div key={s.id} className="flex justify-between items-center text-sm p-3 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-100 transition-all">
                  <div>
                    <span className="font-bold block text-slate-800 text-lg">${s.amount}</span>
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">{s.sellerName}</span>
                  </div>
                  <span className="text-slate-400 bg-slate-100 px-2 py-1 rounded text-xs">{s.date}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

interface AuditLogProps {
  logs: Log[];
}

const AuditLog = ({ logs }: AuditLogProps) => (
  <div>
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-slate-900">Auditoría</h2>
      <p className="text-slate-500 text-sm">Registro inmutable de todas las acciones del sistema.</p>
    </div>
    
    <Card noPadding>
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-900 text-slate-300">
          <tr><th className="p-4 pl-6 font-semibold">Usuario</th><th className="p-4 font-semibold">Acción</th><th className="p-4 font-semibold">Objetivo</th><th className="p-4 pr-6 font-semibold text-right">Fecha</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {logs.map(log => (
            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
              <td className="p-4 pl-6 font-bold text-slate-700">{log.user}</td>
              <td className="p-4"><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-mono border border-slate-200">{log.action}</span></td>
              <td className="p-4 text-slate-500">{log.target}</td>
              <td className="p-4 pr-6 text-slate-400 text-right">{log.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

// --- MAIN DASHBOARD SHELL ---

interface AdminDashboardProps {
  user: AppUser;
  onLogout: () => void;
  heroImages: string[];
  setHeroImages: (images: string[]) => void;
  logoUrl: string | null;
  setLogoUrl: (url: string) => void;
}

const AdminDashboard = ({ user, onLogout, heroImages, setHeroImages, logoUrl, setLogoUrl }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('analytics');
  
  const [users, setUsers] = useState(INITIAL_USERS);
  const [sales, setSales] = useState(INITIAL_SALES);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  
  const canViewStats = can(user, PERMISSIONS.STATS_GLOBAL_VIEW) || can(user, PERMISSIONS.STATS_PERSONAL_VIEW);
  const canViewFinance = can(user, PERMISSIONS.FINANCE_VIEW);
  const canManageUsers = can(user, PERMISSIONS.USERS_MANAGE);
  const canViewAudit = can(user, PERMISSIONS.AUDIT_LOGS_VIEW);
  const canViewABTest = user.roleName === 'OWNER'; 
  const canManageWeb = user.roleName === 'OWNER';

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 text-slate-300 fixed h-full hidden md:flex flex-col z-20 shadow-xl border-r border-slate-800">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 text-white mb-8">
            <div className="bg-blue-600 p-2 rounded-lg"><Sun size={24} fill="currentColor"/></div>
            <div>
              <span className="block text-lg font-extrabold tracking-tight leading-none">FLORIPA</span>
              <span className="block text-lg font-extrabold tracking-tight leading-none text-blue-500">ADMIN</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center font-bold text-white shadow-lg">{user.name[0]}</div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{user.roleName}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider mt-4">Gestión</div>
          {canViewFinance && (
             <button onClick={() => setActiveTab('finance')} className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group font-medium ${activeTab === 'finance' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
               <Target size={20} className={`mr-3 ${activeTab === 'finance' ? 'text-blue-200' : 'text-slate-500 group-hover:text-blue-400'}`} /> Finanzas CEO
             </button>
          )}
          {canManageWeb && (
             <button onClick={() => setActiveTab('webconfig')} className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group font-medium ${activeTab === 'webconfig' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
               <Layout size={20} className={`mr-3 ${activeTab === 'webconfig' ? 'text-blue-200' : 'text-slate-500 group-hover:text-blue-400'}`} /> Config. Web
             </button>
          )}
          {canViewABTest && (
             <button onClick={() => setActiveTab('abtest')} className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group font-medium ${activeTab === 'abtest' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
               <Split size={20} className={`mr-3 ${activeTab === 'abtest' ? 'text-blue-200' : 'text-slate-500 group-hover:text-blue-400'}`} /> A/B Testing
             </button>
          )}
          {canViewStats && (
            <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group font-medium ${activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
              <BarChart3 size={20} className={`mr-3 ${activeTab === 'analytics' ? 'text-blue-200' : 'text-slate-500 group-hover:text-blue-400'}`} /> Operativo
            </button>
          )}
          
          <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider mt-6">Administración</div>
          {canManageUsers && (
            <button onClick={() => setActiveTab('users')} className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group font-medium ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
              <Users size={20} className={`mr-3 ${activeTab === 'users' ? 'text-blue-200' : 'text-slate-500 group-hover:text-blue-400'}`} /> Usuarios
            </button>
          )}
          {canViewAudit && (
            <button onClick={() => setActiveTab('audit')} className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group font-medium ${activeTab === 'audit' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
              <Activity size={20} className={`mr-3 ${activeTab === 'audit' ? 'text-blue-200' : 'text-slate-500 group-hover:text-blue-400'}`} /> Auditoría
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button onClick={onLogout} className="w-full flex items-center p-3 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors font-medium">
            <LogOut size={20} className="mr-3" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden fixed w-full bg-slate-900 text-white p-4 z-20 flex justify-between items-center shadow-md">
        <span className="font-extrabold flex items-center gap-2"><Sun size={18} className="text-blue-500"/> FLORIPA ADMIN</span>
        <button onClick={onLogout}><LogOut size={20}/></button>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-72 p-6 md:p-12 pt-24 md:pt-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'finance' && canViewFinance && <FinanceDashboard />}
          {activeTab === 'webconfig' && canManageWeb && <WebConfig heroImages={heroImages} setHeroImages={setHeroImages} logoUrl={logoUrl} setLogoUrl={setLogoUrl} />}
          {activeTab === 'abtest' && canViewABTest && <ABTestDashboard />}
          {activeTab === 'analytics' && <AnalyticsDashboard sales={sales} users={users} currentUser={user} />}
          {activeTab === 'users' && <UserManagement users={users} setUsers={setUsers} roles={INITIAL_ROLES} currentUser={user} />}
          {activeTab === 'audit' && <AuditLog logs={logs} />}
        </div>
      </main>
    </div>
  );
};

// --- AUTH SCREEN ---

const mockLogin = (email: string, password: string) => {
  // Verificación específica para el dueño con la contraseña solicitada
  if (email === 'info.floripafacil@gmail.com' && password !== 'Colo1981!') {
    return null;
  }

  const found = INITIAL_USERS.find(u => u.email === email && u.isActive);
  if (found) {
    const role = INITIAL_ROLES.find(r => r.name === found.roleName);
    return { ...found, permissions: role ? role.permissions : [] };
  }
  return null;
};

interface AdminLoginProps {
  onLogin: (user: AppUser) => void;
  setView: (view: { name: string; params: any }) => void;
}

const AdminLogin = ({ onLogin, setView }: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = mockLogin(email, pass);
    if (user) onLogin(user);
    else setError(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-sm animate-in fade-in zoom-in-95 border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Shield size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Acceso Staff</h2>
          <p className="text-sm text-slate-400 mt-2">Solo personal autorizado</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <div className="absolute left-4 top-3.5 text-slate-400"><Briefcase size={18} /></div>
            <input className="w-full pl-11 p-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-slate-700 font-medium" placeholder="Email corporativo" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="relative">
            <div className="absolute left-4 top-3.5 text-slate-400"><Lock size={18} /></div>
            <input type="password" className="w-full pl-11 p-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-slate-700 font-medium" placeholder="Contraseña" value={pass} onChange={e => setPass(e.target.value)} />
          </div>
          {error && <div className="bg-red-50 text-red-600 p-3 text-sm rounded-lg text-center font-bold border border-red-100 flex items-center justify-center gap-2"><AlertCircle size={16}/> Credenciales inválidas</div>}
          <Button className="w-full shadow-lg shadow-blue-600/20">Ingresar al Sistema</Button>
        </form>
        <button onClick={() => setView({ name: 'HOME', params: null })} className="w-full text-center text-sm text-slate-400 mt-8 hover:text-blue-600 transition-colors font-medium">Volver al sitio público</button>
      </div>
    </div>
  );
};

// --- APP ROOT (NO CHANGE) ---

const App = () => {
  const [currentView, setView] = useState<{name: string, params: any}>({ name: 'HOME', params: null });
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  
  const [variant, setVariant] = useState<'A' | 'B'>('A');
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    // 1. Load A/B Variant
    const savedVariant = localStorage.getItem('ab_variant');
    if (savedVariant === 'A' || savedVariant === 'B') {
      setVariant(savedVariant);
    } else {
      const newVariant = Math.random() < 0.5 ? 'A' : 'B';
      localStorage.setItem('ab_variant', newVariant);
      setVariant(newVariant);
    }

    // 2. Fetch Dynamic Content (Activities, Images)
    // This forces fresh data on client mount, fixing the stale Vercel build issue
    getPublicContent().then(data => {
      if (data) {
        setHeroImages(data.heroImages || FALLBACK_HERO_IMAGES);
        setActivities(data.activities || []);
        // Note: Logo URL could also be fetched here if dynamic
      }
    }).catch(err => {
      console.error("Failed to fetch public content", err);
      setHeroImages(FALLBACK_HERO_IMAGES);
    });

  }, []);

  const handleTrack = (event: 'views' | 'ctaClicks' | 'whatsappStarts') => {
    trackABEvent(variant, event);
  };

  if (currentView.name === 'ADMIN' && currentUser) {
    return <AdminDashboard 
             user={currentUser} 
             onLogout={() => { setCurrentUser(null); setView({ name: 'HOME', params: null }); }} 
             heroImages={heroImages}
             setHeroImages={setHeroImages}
             logoUrl={logoUrl}
             setLogoUrl={setLogoUrl}
           />;
  }
  
  if (currentView.name === 'ADMIN_LOGIN') {
    return <AdminLogin onLogin={(user) => { setCurrentUser(user); setView({ name: 'ADMIN', params: null }); }} setView={setView} />;
  }

  return (
    <>
      <PublicNavbar setView={setView} logoUrl={logoUrl} />
      {variant === 'A' ? (
        <LandingPageA setView={setView} onTrack={handleTrack} heroImages={heroImages} activities={activities} />
      ) : (
        <LandingPageB setView={setView} onTrack={handleTrack} heroImages={heroImages} activities={activities} />
      )}
    </>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}