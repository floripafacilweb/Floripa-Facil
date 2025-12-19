
'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, ArrowRight, Star, Sun, MessageCircle, Bus, Menu, X 
} from 'lucide-react';

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

export function LandingUI({ content }: { content: any }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg"><Bus size={20}/></div>
            <span className={`text-xl font-black tracking-tight ${scrolled ? 'text-slate-900' : 'text-white'}`}>FLORIPA FÁCIL</span>
          </div>
          <div className="flex gap-4">
             <Button variant={scrolled ? 'primary' : 'outline'} className={!scrolled ? '!bg-white/10 !text-white !border-white/20' : ''}>Staff</Button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-900 min-h-[85vh] flex items-center">
        <HeroSlider images={content.heroImages} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-900 font-bold text-xs mb-6 shadow-xl animate-in fade-in">
               <Star size={12} fill="currentColor" /> 4.9/5 - Logística y Tours en Brasil
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-md">
              {content.hero.title.split(' ')[0]} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">
                {content.hero.title.split(' ').slice(1).join(' ')}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 mb-10 max-w-2xl leading-relaxed drop-shadow-sm">{content.hero.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="shimmer" className="!text-lg !px-10 !py-4 shadow-2xl hover:-translate-y-1 transform transition-all">
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
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Actividades Destacadas</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Los combos y traslados más solicitados para tu viaje. Actualizado en tiempo real.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.activities.map((act: any) => (
              <ActivityCard key={act.id} {...act} />
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Nuestros Destinos</h2>
            <p className="text-lg text-slate-500">Operamos en los puntos más importantes del sur de Brasil con personal local.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {content.destinations.map((dest: any, i: number) => (
              <div key={i} className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: `url('${dest.img}')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-0 p-8 text-white w-full">
                  <h3 className="text-3xl font-bold mb-2">{dest.title}</h3>
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed">{dest.desc}</p>
                  <div className="text-emerald-400 text-sm font-bold flex items-center group-hover:gap-4 transition-all">Ver más <ArrowRight size={18} className="ml-2"/></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-500 py-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="bg-slate-800 p-2 rounded-lg"><Bus size={24}/></div>
            <span className="text-2xl font-black text-white tracking-tight">FLORIPA FÁCIL</span>
          </div>
          <p className="max-w-md mx-auto mb-8 text-slate-400">Expertos en logística turística y experiencias inolvidables en el sur de Brasil. Tu viaje empieza aquí.</p>
          <div className="text-sm">© 2024 Floripa Fácil. Todos los derechos reservados.</div>
        </div>
      </footer>
    </div>
  );
}
